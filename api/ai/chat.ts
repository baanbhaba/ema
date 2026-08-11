import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";

const FALLBACK_NVIDIA_KEY = "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";
const FALLBACK_AIML_KEY = "a89e74ba7f517327fd7481a118053119";

/**
 * POST /api/v1/ai/chat
 * Server-side AI proxy — holds the API key, never exposed to the client.
 * Also tracks usage in DB when available.
 *
 * Body: { model, messages, temperature?, max_tokens?, provider?, projectId? }
 * provider: "nvidia" (default) | "aiml"
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { model, messages, temperature, max_tokens, provider, projectId } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const useAiml = provider === "aiml";

  const apiKey = useAiml
    ? (process.env.AIML_API_KEY || process.env.VITE_AIML_API_KEY || FALLBACK_AIML_KEY)
    : (process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY || FALLBACK_NVIDIA_KEY);

  const endpoint = useAiml
    ? "https://api.aimlapi.com/v1/chat/completions"
    : "https://integrate.api.nvidia.com/v1/chat/completions";

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: model || "meta/llama-3.1-70b-instruct",
        messages,
        temperature: temperature ?? 0.1,
        max_tokens: max_tokens ?? 1200,
      }),
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const bodyText = await upstream.text();

    if (!upstream.ok) {
      console.error(`[AI PROXY ERROR] Upstream ${endpoint} returned status ${upstream.status}: ${bodyText}`);
    }

    // Track usage in audit history asynchronously in background
    if (upstream.ok) {
      Promise.resolve().then(async () => {
        try {
          const parsed = JSON.parse(bodyText);
          const totalTokens = parsed.usage?.total_tokens ?? 0;
          const promptTokens = parsed.usage?.prompt_tokens ?? 0;
          const completionTokens = parsed.usage?.completion_tokens ?? 0;

          await prisma.auditHistory.create({
            data: {
              projectId: typeof projectId === "string" ? projectId : null,
              action: "AI_TOKEN_USAGE",
              metadata: {
                provider: useAiml ? "aiml" : "nvidia",
                model: model || "meta/llama-3.1-70b-instruct",
                totalTokens,
                promptTokens,
                completionTokens,
                timestamp: new Date().toISOString(),
              },
            },
          });
        } catch (_ignore) {}
      });
    }

    res.status(upstream.status).setHeader("content-type", contentType).send(bodyText);
  } catch (err: any) {
    console.error("AI proxy error:", err);
    return res.status(502).json({ error: `AI upstream error: ${err.message}` });
  }
}
