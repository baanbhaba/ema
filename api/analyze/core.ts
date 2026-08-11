import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";
import { detectJavaStack, detectJavaDeprecatedUsages } from "../../src/lib/analysis";
import { completeJson } from "../../src/server/llm";
import { refreshProjectReadiness } from "../../src/server/auditMapping";

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
    return res.status(405).end("Method Not Allowed");
  }

  const { project_id, code, ingestion_manifest } = req.body || {};

  try {
    let fileName = "Main.java";
    let javaCode = typeof code === "string" ? code : "";

    if (project_id && !javaCode) {
      const project = await prisma.project.findUnique({
        where: { id: project_id },
        include: { uploadedSources: true },
      });
      if (project) {
        fileName = project.uploadedSources[0]?.fileName || `${project.name}.java`;
        javaCode = project.uploadedSources[0]?.rawCode || "";
      }
    }

    if (!javaCode && typeof ingestion_manifest === "string") {
      javaCode = ingestion_manifest;
    }

    let audit: any = null;

    if (javaCode.trim()) {
      audit = await completeJson(CORE_SYSTEM_PROMPT, javaCode, { maxTokens: 1800 });
      if (audit && (!audit.architecture_summary || !Array.isArray(audit.detected_stack))) {
        audit = null;
      }
    }

    if (!audit) {
      const detectedStack = detectJavaStack(javaCode);
      const detectedUsages = detectJavaDeprecatedUsages(javaCode, fileName);
      audit = {
        architecture_summary: javaCode.trim()
          ? `Core Architecture Audit for the uploaded Java codebase (${fileName}).`
          : "No Java source provided for analysis.",
        detected_stack: detectedStack,
        deprecated_usages: detectedUsages,
        dependency_graph: {
          nodes: [fileName.replace(/\.java$/, "")],
          edges: [],
        },
        diagrams: [],
        confidence: 0.9,
      };
    }

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

    return res.status(200).json(audit);
  } catch (error) {
    console.error("POST /api/analyze/core error:", error);
    return res.status(500).json({ error: "Failed to execute core analysis" });
  }
}
