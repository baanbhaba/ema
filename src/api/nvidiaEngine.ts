import { useAuthStore } from "../store/useAuthStore";
import type { CoreAudit, ImpactAudit, Blueprint } from "../types/contracts";

const getDevCredentials = () => {
  const { isDevMode, devApiKey, devBaseUrl } = useAuthStore.getState();
  if (isDevMode && devApiKey && devApiKey.trim().length > 0) {
    const baseUrl =
      devBaseUrl && devBaseUrl.startsWith("http")
        ? devBaseUrl
        : "https://integrate.api.nvidia.com/v1";
    return { apiKey: devApiKey.trim(), endpoint: `${baseUrl.replace(/\/$/, "")}/chat/completions` };
  }
  return null;
};

const extractJsonBlock = (rawText: string): string => {
  let text = rawText.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
};

export const analyzeCoreWithNvidia = async (
  projectName: string,
  javaCode: string
): Promise<CoreAudit | null> => {
  const creds = getDevCredentials();
  if (!creds) return null;

  try {
    const response = await fetch(creds.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: `You are the EMA Core Analysis Agent. Analyze the provided Java code and return ONLY valid JSON matching this schema:
{
  "architecture_summary": "string",
  "detected_stack": [{"technology": "string", "version": "string", "status": "eol|deprecated|current"}],
  "deprecated_usages": [{"file": "string", "line": 1, "pattern": "string", "recommended_replacement": "string"}],
  "dependency_graph": {"nodes": ["string"], "edges": [{"from": "string", "to": "string"}]},
  "diagrams": [{"type": "string", "format": "mermaid", "content": "string"}],
  "confidence": 0.92
}`,
          },
          {
            role: "user",
            content: `Project Name: ${projectName}\nSource Code:\n${javaCode || "public class App { public static void main(String[] args) {} }"}`
          },
        ],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    const cleanJson = extractJsonBlock(rawContent);
    return JSON.parse(cleanJson) as CoreAudit;
  } catch (err) {
    console.warn("NVIDIA Core Analysis error:", err);
    return null;
  }
};

export const analyzeImpactWithNvidia = async (
  projectName: string,
  javaCode: string
): Promise<ImpactAudit | null> => {
  const creds = getDevCredentials();
  if (!creds) return null;

  try {
    const response = await fetch(creds.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: `You are the EMA Impact Analysis Agent. Analyze breaking changes for migrating this Java code to Java 21 / Rust Axum and return ONLY valid JSON matching this schema:
{
  "api_surface": [{"endpoint_or_interface": "string", "consumers": ["string"], "breaking_change_risk": "low|medium|high"}],
  "database_impacts": [{"component": "string", "risk": "low|medium|high", "notes": "string"}],
  "config_impacts": [{"file": "string", "risk": "low|medium|high", "notes": "string"}],
  "dependency_risks": [{"library": "string", "current_version": "string", "target_version": "string", "known_breaking_changes": ["string"]}],
  "blast_radius": [{"change": "string", "affected_files": ["string"], "severity": "low|medium|high"}],
  "confidence": 0.89
}`,
          },
          {
            role: "user",
            content: `Project Name: ${projectName}\nSource Code:\n${javaCode || "public class App {}"}`
          },
        ],
        temperature: 0.1,
        max_tokens: 800,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    const cleanJson = extractJsonBlock(rawContent);
    return JSON.parse(cleanJson) as ImpactAudit;
  } catch (err) {
    console.warn("NVIDIA Impact Analysis error:", err);
    return null;
  }
};

export const generateBlueprintWithNvidia = async (
  projectId: string,
  projectName: string,
  javaCode: string
): Promise<Blueprint | null> => {
  const creds = getDevCredentials();
  if (!creds) return null;

  try {
    const response = await fetch(creds.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: `You are the EMA Blueprint Agent. Create a concise 3-step migration blueprint for migrating this project to Java 21 / Rust Axum. Return ONLY valid JSON:
{
  "project_id": "${projectId}",
  "steps": [
    {
      "id": "step-1",
      "file_or_module": "string",
      "what_changes": "string",
      "why": "string",
      "target_pattern": "string",
      "risk_level": "medium",
      "depends_on": [],
      "status": "pending"
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Project ID: ${projectId}\nProject Name: ${projectName}\nSource Code:\n${javaCode || "public class App {}"}`
          },
        ],
        temperature: 0.1,
        max_tokens: 600,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    const cleanJson = extractJsonBlock(rawContent);
    const parsed = JSON.parse(cleanJson) as Blueprint;
    parsed.project_id = projectId;
    if (parsed.steps) {
      parsed.steps = parsed.steps.map((s, idx) => ({
        id: s.id || `step-${idx + 1}`,
        file_or_module: s.file_or_module || "src/Main.java",
        what_changes: s.what_changes || "Migrate Java code",
        why: s.why || "Modernization",
        target_pattern: s.target_pattern || "// Transformed target code",
        risk_level: ["low", "medium", "high"].includes(s.risk_level) ? s.risk_level : "medium",
        depends_on: Array.isArray(s.depends_on) ? s.depends_on : [],
        status: "pending",
      }));
    }
    return parsed;
  } catch (err) {
    console.warn("NVIDIA Blueprint generation error:", err);
    return null;
  }
};
