import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";
import { detectJavaImpactAudit } from "../../src/lib/analysis";
import { completeJson } from "../../src/server/llm";
import { refreshProjectReadiness } from "../../src/server/auditMapping";

const IMPACT_SYSTEM_PROMPT = `
You are the Impact Analysis Agent in ALCHEMI (Automated Legacy Code Transformation Engine).
Analyze the provided Java source and return ONLY valid JSON matching this exact schema:
{
  "api_surface": [{ "endpoint_or_interface": "Controller.java", "consumers": ["Web Client"], "breaking_change_risk": "medium" }],
  "database_impacts": [{ "component": "Hibernate Dialect", "risk": "medium", "notes": "Upgrade path" }],
  "config_impacts": [{ "file": "application.yml", "risk": "low", "notes": "Property migration" }],
  "dependency_risks": [{ "library": "Spring Web", "current_version": "2.4", "target_version": "3.2", "known_breaking_changes": ["javax -> jakarta relocation"] }],
  "blast_radius": [{ "change": "Modernize Controller.java", "affected_files": ["Controller.java"], "severity": "medium" }],
  "confidence": 0.92
}
breaking_change_risk and severity must be one of: low | medium | high.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed. Use POST.` });
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

    audit = await completeJson(IMPACT_SYSTEM_PROMPT, javaCode, { maxTokens: 1800 });
    if (audit && !Array.isArray(audit.api_surface)) {
      audit = null;
    }

    // ── Tier 2: Static impact analysis on real uploaded code ───────────────
    if (!audit) {
      audit = detectJavaImpactAudit(javaCode, fileName);
    }

    // ── Persist to DB ──────────────────────────────────────────────────────
    if (project_id) {
      await prisma.impactAudit.upsert({
        where: { projectId: project_id },
        update: {
          apiSurface: audit.api_surface,
          databaseImpacts: audit.database_impacts,
          configImpacts: audit.config_impacts,
          dependencyRisks: audit.dependency_risks,
          blastRadius: audit.blast_radius,
          confidence: audit.confidence,
        },
        create: {
          projectId: project_id,
          apiSurface: audit.api_surface,
          databaseImpacts: audit.database_impacts,
          configImpacts: audit.config_impacts,
          dependencyRisks: audit.dependency_risks,
          blastRadius: audit.blast_radius,
          confidence: audit.confidence,
        },
      });
      await refreshProjectReadiness(project_id);
    }

    return res.status(200).json(audit);
  } catch (error: any) {
    console.error("POST /api/analyze/impact error:", error);
    return res.status(500).json({
      error: "Impact analysis failed",
      detail: error?.message || "Unknown server error",
    });
  }
}
