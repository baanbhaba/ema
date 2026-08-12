import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";
import { generateRustCodeFromJava } from "../../src/api/transform";
import { mapProjectToSummary } from "../../src/server/projectMapping";
import {
  detectJavaStack,
  detectJavaDeprecatedUsages,
  detectJavaImpactAudit,
  calculateReadinessScore,
} from "../../src/lib/analysis";
import { authorizeTenant } from "../utils/tenant";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authorizeTenant(req, res);
  if (!auth) return; // Response handled

  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        where: auth.isSuperDev ? undefined : {
          OR: [
            { userId: auth.user.id },
            {
              organization: {
                members: { some: { userId: auth.user.id } }
              }
            }
          ]
        },
        orderBy: { updatedAt: "desc" },
        include: {
          coreAudit: true,
          impactAudit: true,
          readinessAssessment: true,
        },
      });
      return res.status(200).json(projects.map(mapProjectToSummary));
    } catch (error) {
      console.error("GET /api/projects error:", error);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  if (req.method === "POST") {
    try {
      const { id, name, repoUrl, repo_url, stage, javaCode, organizationId, targetStack } = req.body || {};

      if (!name) {
        return res.status(400).json({ error: "Project name is required" });
      }

      let initialReadiness = 0;
      if (javaCode && javaCode.trim()) {
        const fileName = `${name.replace(/[^a-zA-Z0-9_]/g, "")}.java`;
        const detectedStack = detectJavaStack(javaCode);
        const deprecatedUsages = detectJavaDeprecatedUsages(javaCode, fileName);
        const core = {
          id: "",
          projectId: "",
          architecture_summary: "",
          architectureSummary: "",
          detected_stack: detectedStack,
          detectedStack,
          deprecated_usages: deprecatedUsages,
          deprecatedUsages,
          dependency_graph: { nodes: [], edges: [] },
          dependencyGraph: { nodes: [], edges: [] },
          diagrams: [],
          confidence: 0.72,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const impact = detectJavaImpactAudit(javaCode, fileName);
        const readiness = calculateReadinessScore(core, impact, null);
        initialReadiness = readiness.overall;
      }

      const project = await prisma.project.create({
        data: {
          id: id || undefined,
          name,
          userId: organizationId ? undefined : auth.user.id,
          organizationId: organizationId || undefined,
          repoUrl: repoUrl || repo_url || "",
          stage: stage || (javaCode ? "analyzing" : "ingesting"),
          targetStack: targetStack || "rust-axum",
          readinessScore: initialReadiness,
          uploadedSources: javaCode
            ? {
                create: [
                  {
                    fileName: `${name.replace(/[^a-zA-Z0-9_]/g, "")}.java`,
                    rawCode: javaCode,
                    language: "java",
                  },
                ],
              }
            : undefined,
          blueprint: {
            create: {
              version: 1,
              steps: {
                create: [
                  {
                    stepNumber: 1,
                    fileOrModule: `${name.replace(/[^a-zA-Z0-9_]/g, "")}.java`,
                    whatChanges: `Upgrade bytecode & convert REST controller logic to ${targetStack || 'Axum'} router`,
                    why: `Modernize Java application to ${targetStack || 'Rust Tokio'} runtime`,
                    targetPattern: generateRustCodeFromJava(javaCode || `public class ${name.replace(/[^a-zA-Z0-9_]/g, "")} {}`, "step-1", targetStack || "rust-axum"),
                    riskLevel: "medium",
                    status: "pending",
                  },
                ],
              },
            },
          },
        },
        include: {
          blueprint: { include: { steps: true } },
          uploadedSources: true,
        },
      });

      return res.status(201).json(mapProjectToSummary(project));
    } catch (error) {
      console.error("POST /api/projects error:", error);
      return res.status(500).json({ error: "Failed to create project" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
