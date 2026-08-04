import type { CoreAudit, ImpactAudit } from "../types/contracts";
import type { ParsedJavaProject } from "../utils/javaParser";

export const callAiApi = async (
  apiKey: string,
  prompt: string,
  model: string = "meta/llama-3.3-70b-instruct",
  baseUrl?: string
): Promise<string> => {
  const effectiveApiKey = apiKey || "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";
  const effectiveBaseUrl = baseUrl || "https://integrate.api.nvidia.com/v1";
  const cleanBaseUrl = effectiveBaseUrl.endsWith("/") ? effectiveBaseUrl.slice(0, -1) : effectiveBaseUrl;

  let endpointsToTry: string[] = [];

  if (typeof window !== "undefined" && window.location.origin) {
    endpointsToTry.push("/nvidia-api/v1/chat/completions");
  }
  const directEndpoint = cleanBaseUrl.endsWith("/chat/completions") ? cleanBaseUrl : `${cleanBaseUrl}/chat/completions`;
  endpointsToTry.push(directEndpoint);

  // Deduplicate endpoints
  endpointsToTry = Array.from(new Set(endpointsToTry));

  const bodyPayload: any = {
    model: model || "meta/llama-3.3-70b-instruct",
    messages: [
      {
        role: "system",
        content: "You are EMA (Engineering Migration Assistant), an expert AI engine that migrates legacy Java Spring Boot codebases to modern Rust Axum microservices.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  let lastError: Error | null = null;

  for (const endpoint of endpointsToTry) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveApiKey.trim()}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI API Request Failed (${response.status}): ${errText}`);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response received from AI API.");
      }

      return content;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("Failed to connect to AI API.");
};

// Keep backwards-compatible alias
export const callDeepSeekApi = callAiApi;

export const generateCoreAuditWithAI = async (
  apiKey: string,
  project: ParsedJavaProject,
  model: string = "meta/llama-3.3-70b-instruct",
  baseUrl?: string
): Promise<CoreAudit> => {
  const prompt = `
Analyze this Java project manifest and return a JSON matching the CoreAudit contract.
Project Name: ${project.projectName}
Total Lines of Code: ${project.totalLoc}
Detected Classes: ${project.detectedClasses.join(", ")}
Controllers: ${project.detectedControllers.join(", ")}
Services: ${project.detectedServices.join(", ")}
Repositories: ${project.detectedRepositories.join(", ")}

Java Source Files:
${project.files.map((f) => `--- File: ${f.fileName} ---\n${f.rawCode}`).join("\n\n")}

Return strictly valid raw JSON matching this structure without markdown code fencing:
{
  "architecture_summary": "High-level Java architecture summary",
  "detected_stack": [{ "technology": "Java", "version": "1.8.0", "status": "eol" }],
  "deprecated_usages": [{ "file": "FileName.java", "line": 10, "pattern": "deprecated pattern", "recommended_replacement": "Rust equivalent" }],
  "dependency_graph": { "nodes": ["ClassA"], "edges": [{ "from": "ClassA", "to": "ClassB" }] },
  "diagrams": [{ "type": "component", "format": "mermaid", "content": "graph TD\\n A --> B" }],
  "confidence": 0.95
}
`;

  const rawRes = await callAiApi(apiKey, prompt, model, baseUrl);
  const cleanJson = rawRes.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanJson);
};

export const generateImpactAuditWithAI = async (
  apiKey: string,
  project: ParsedJavaProject,
  model: string = "meta/llama-3.3-70b-instruct",
  baseUrl?: string
): Promise<ImpactAudit> => {
  const prompt = `
Evaluate the migration impact of moving this Java project to Rust Axum.
Project Name: ${project.projectName}
Controllers: ${project.detectedControllers.join(", ")}
Services: ${project.detectedServices.join(", ")}

Java Source Files:
${project.files.map((f) => `--- File: ${f.fileName} ---\n${f.rawCode}`).join("\n\n")}

Return strictly valid raw JSON matching this structure without markdown code fencing:
{
  "api_surface": [{ "endpoint_or_interface": "GET /api/v1/users", "consumers": ["Frontend"], "breaking_change_risk": "medium" }],
  "database_impacts": [{ "component": "UserEntity", "risk": "low", "notes": "Map JPA to SQLx struct" }],
  "config_impacts": [{ "file": "application.properties", "risk": "low", "notes": "Convert to env variables or config crate" }],
  "dependency_risks": [{ "library": "Spring Web", "current_version": "2.7.0", "target_version": "Axum 0.7", "known_breaking_changes": ["Replace annotation routing with Axum Router"] }],
  "blast_radius": [{ "change": "Rewrite UserController to Axum handler", "affected_files": ["UserController.java"], "severity": "medium" }],
  "confidence": 0.92
}
`;

  const rawRes = await callAiApi(apiKey, prompt, model, baseUrl);
  const cleanJson = rawRes.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanJson);
};

export const transformJavaToRustAxumWithAI = async (
  apiKey: string,
  javaCode: string,
  fileName: string,
  model: string = "meta/llama-3.3-70b-instruct",
  baseUrl?: string
): Promise<string> => {
  const prompt = `
Convert the following Java code into idiomatic, production-ready Rust code using Axum 0.7, Tokio, and Serde.
FileName: ${fileName}

Java Source Code:
${javaCode}

Rules:
1. Convert Java classes / POJOs to Rust \`#[derive(Serialize, Deserialize, Clone, Debug)] pub struct\`
2. Convert Java Spring \`@RestController\` / \`@GetMapping\` / \`@PostMapping\` methods to async Axum handler functions (\`pub async fn handler(...) -> impl IntoResponse\`).
3. Replace Java \`ArrayList\` / \`List\` with Rust \`Vec\`.
4. Return ONLY valid, compilable Rust code block.
`;

  return await callAiApi(apiKey, prompt, model, baseUrl);
};
