import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * POST /api/v1/ai/chat
 * Server-side AI proxy — holds the API key, never exposed to the client.
 *
 * Body: { model, messages, temperature?, max_tokens?, provider? }
 * provider: "nvidia" (default) | "aiml"
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { model, messages, temperature, max_tokens, provider } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const useAiml = provider === "aiml";

  const apiKey = useAiml
    ? process.env.AIML_API_KEY
    : process.env.NVIDIA_API_KEY;

  const endpoint = useAiml
    ? "https://api.aimlapi.com/v1/chat/completions"
    : "https://integrate.api.nvidia.com/v1/chat/completions";

  if (!apiKey) {
    return res
      .status(503)
      .json({ error: `${useAiml ? "AIML_API_KEY" : "NVIDIA_API_KEY"} is not configured on the server.` });
  }

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

    const contentType = upstream.headers.get("content-type") || "";
    const body = await upstream.text();

    res.status(upstream.status).setHeader("content-type", contentType).send(body);
  } catch (err: any) {
    console.error("AI proxy error:", err);
    return res.status(502).json({ error: `AI upstream error: ${err.message}` });
  }
}
