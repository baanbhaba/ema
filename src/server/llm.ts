const DEFAULT_MODEL = "meta/llama-3.1-70b-instruct";

export async function completeJson<T>(
  systemPrompt: string,
  userContent: string,
  opts?: { temperature?: number; maxTokens?: number }
): Promise<T | null> {
  const apiKey = process.env.NVIDIA_API_KEY || process.env.AIML_API_KEY;
  if (!apiKey) return null;

  const endpoint = process.env.NVIDIA_API_KEY
    ? "https://integrate.api.nvidia.com/v1/chat/completions"
    : "https://api.aimlapi.com/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: opts?.temperature ?? 0.2,
        max_tokens: opts?.maxTokens ?? 1600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      console.error(`[LLM SERVER ERROR] Upstream API call failed (${response.status}): ${errText}`);
      throw new Error(`Upstream AI API error (${response.status}): ${errText}`);
    }

    const data: any = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error("[LLM SERVER ERROR] Upstream API returned empty choices or message content.");
      throw new Error("Upstream AI API returned empty message content");
    }

    const cleaned = content
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("LLM structured completion failed:", err);
    throw err;
  }
}
