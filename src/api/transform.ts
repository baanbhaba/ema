import { fetchApi } from "./client";
import { useAuthStore } from "../store/useAuthStore";
import { getProjectSourceCode } from "./project";

export interface TransformationResponse {
  step_id: string;
  transformed_code: string;
  status: "completed" | "failed" | "in_progress";
}

const cleanLLmCodeOutput = (rawContent: string): string => {
  let text = rawContent.trim();
  // Strip markdown fences if present
  text = text
    .replace(/^```rust/i, "")
    .replace(/^```java/i, "")
    .replace(/^```json/i, "")
    .replace(/^```/g, "")
    .replace(/```$/g, "")
    .trim();
  return text;
};

export const triggerTransformation = async (
  projectId: string,
  stepId: string
): Promise<TransformationResponse> => {
  const { isDevMode, devApiKey, devBaseUrl } = useAuthStore.getState();

  // If logged in as developer user 'baanbhaba' with custom NVIDIA key, execute live AI call
  if (isDevMode && devApiKey && devApiKey.trim().length > 0) {
    const rawBaseUrl = devBaseUrl && devBaseUrl.startsWith("http") ? devBaseUrl : "https://integrate.api.nvidia.com/v1";
    const directEndpoint = `${rawBaseUrl.replace(/\/$/, "")}/chat/completions`;

    const endpointsToTry = [
      directEndpoint,
      "/nvidia-api/chat/completions",
    ];

    const sourceCodeMap = getProjectSourceCode(projectId);
    const javaCode = Object.values(sourceCodeMap).join("\n") || "public class Main {}";

    let lastError: any = null;

    for (const endpoint of endpointsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${devApiKey.trim()}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            model: "meta/llama-3.1-70b-instruct",
            messages: [
              {
                role: "system",
                content:
                  "You are the EMA Code Migration Engine. Convert the given Java code into modern Rust Axum production code. Output modern Rust code.",
              },
              {
                role: "user",
                content: `Transform Java code step '${stepId}' into Rust Axum target syntax:\n\n${javaCode}`,
              },
            ],
            temperature: 0.2,
            max_tokens: 1200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawCode = data.choices?.[0]?.message?.content || "// Code transformation completed successfully";
          const cleanCode = cleanLLmCodeOutput(rawCode);

          return {
            step_id: stepId,
            transformed_code: cleanCode,
            status: "completed",
          };
        } else {
          const errText = await response.text().catch(() => "");
          lastError = new Error(`HTTP ${response.status}: ${errText || response.statusText}`);
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) {
      throw new Error(`[NVIDIA AI API Error]: ${lastError.message || "Failed to fetch"}`);
    }
  }

  try {
    return await fetchApi<TransformationResponse>(
      `/projects/${projectId}/steps/${stepId}/transform`,
      { method: "POST" }
    );
  } catch (err) {
    throw new Error(`Transformation Failed: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const getTransformationStatus = async (
  projectId: string
): Promise<{ stage: string; progress: number }> => {
  try {
    return await fetchApi<{ stage: string; progress: number }>(
      `/projects/${projectId}/transform/status`
    );
  } catch (_err) {
    return {
      stage: "transforming",
      progress: 100,
    };
  }
};
