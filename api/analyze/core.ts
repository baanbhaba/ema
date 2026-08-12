import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";
import { detectJavaStack, detectJavaDeprecatedUsages } from "../../src/lib/analysis";
import { completeJson } from "../../src/server/llm";
import { refreshProjectReadiness } from "../../src/server/auditMapping";
import { generateRustCodeFromJava } from "../../src/api/transform";

const CORE_SYSTEM_PROMPT = `
You are the Core Analysis Agent in ALCHEMI (Automated Legacy Code Transformation Engine).
Analyze the provided Java source and return ONLY valid JSON matching this exact schema:
{
  "architecture_summary": "High-level Java architecture summary",
  "detected_stack": [{ "technology": "Java 8", "version": "1.8.0", "status": "eol" }],
  "deprecated_usages": [{ "file": "Sample.java", "line": 5, "pattern": "System.out.println()", "recommended_replacement": "println!()" }],
  "dependency_graph": { "nodes": ["SampleClass"], "edges": [] },
  "diagrams": [{ "type": "component", "format": "mermaid", "content": "graph TD\\n Java --> Rust" }],
  "confidence": 0.95
}
status must be one of: current | deprecated | eol.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed. Use POST.` });
  }

  const { project_id, code, ingestion_manifest } = req.body || {};

  try {
    let fileName = "Main.java";
    let javaCode = typeof code === "string" ? code : "";

    // Load from DB if no code provided
    if (project_id && !javaCode) {
      const project = await prisma.project.findUnique({
        where: { id: project_id },
        include: { uploadedSources: true },
      });
      if (!project) {
        return res.status(404).json({ error: `Project '${project_id}' not found` });
      }
      fileName = project.uploadedSources[0]?.fileName || `${project.name}.java`;
      javaCode = project.uploadedSources[0]?.rawCode || "";
    }

    if (!javaCode && typeof ingestion_manifest === "string") {
      javaCode = ingestion_manifest;
    }

    if (!javaCode.trim()) {
      return res.status(400).json({
        error: "No Java source code provided. Include 'code' in the request body or upload source via project creation.",
      });
    }

    // ── Tier 1: AI analysis ────────────────────────────────────────────────
    let audit: any = null;

    audit = await completeJson(CORE_SYSTEM_PROMPT, javaCode, { maxTokens: 1800 });
    if (audit && (!audit.architecture_summary || !Array.isArray(audit.detected_stack))) {
      audit = null;
    }

    // ── Tier 2: Static analysis (real analysis, not predefined data) ───────
    if (!audit) {
      const detectedStack = detectJavaStack(javaCode);
      const detectedUsages = detectJavaDeprecatedUsages(javaCode, fileName);
      const classNames = [...(javaCode.matchAll(/(?:public\s+)?class\s+(\w+)/g))].map(m => m[1]);
      const nodes = classNames.length > 0 ? classNames : [fileName.replace(/\.java$/, "")];
      const edges = nodes.length > 1
        ? nodes.slice(0, -1).map((n: string, i: number) => ({ from: n, to: nodes[i + 1] }))
        : [];

      audit = {
        architecture_summary: `Static analysis of '${fileName}'. Detected ${classNames.length} class(es), ${detectedUsages.length} deprecated pattern(s). ${!process.env.NVIDIA_API_KEY && !process.env.AIML_API_KEY ? "Note: AI analysis unavailable — configure NVIDIA_API_KEY or AIML_API_KEY for deeper insights." : "AI analysis returned no result — falling back to static scan."}`,
        detected_stack: detectedStack,
        deprecated_usages: detectedUsages,
        dependency_graph: { nodes, edges },
        diagrams: [{
          type: "component",
          format: "mermaid",
          content: classNames.length > 0
            ? `graph TD\n${classNames.map((c: string, i: number) => i === 0 ? `  ${c}["${c}"]` : `  ${classNames[i - 1]} --> ${c}["${c}"]`).join("\n")}`
            : `graph TD\n  Source["${fileName}"] --> Target["Java 21 / Rust Axum"]`,
        }],
        confidence: 0.72,
      };
    }

    // ── Persist to DB if project_id provided ──────────────────────────────
    if (project_id) {
      await prisma.coreAudit.upsert({
        where: { projectId: project_id },
        update: {
          architectureSummary: audit.architecture_summary,
          detectedStack: audit.detected_stack,
          deprecatedUsages: audit.deprecated_usages,
          dependencyGraph: audit.dependency_graph,
          diagrams: audit.diagrams,
          confidence: audit.confidence,
        },
        create: {
          projectId: project_id,
          architectureSummary: audit.architecture_summary,
          detectedStack: audit.detected_stack,
          deprecatedUsages: audit.deprecated_usages,
          dependencyGraph: audit.dependency_graph,
          diagrams: audit.diagrams,
          confidence: audit.confidence,
        },
      });
      await refreshProjectReadiness(project_id);
    }

    if (audit) {
      audit.java_code = javaCode;
      audit.rust_code = generateRustCodeFromJava(javaCode, "step-1");
    }

    return res.status(200).json(audit);
  } catch (error: any) {
    console.error("POST /api/analyze/core error:", error);
    return res.status(500).json({
      error: "Core analysis failed",
      detail: error?.message || "Unknown server error",
    });
  }
}
