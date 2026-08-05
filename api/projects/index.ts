import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          coreAudit: true,
          impactAudit: true,
          readinessAssessment: true,
        },
      });
      return res.status(200).json(projects);
    } catch (error) {
      console.error("GET /api/projects error:", error);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, repoUrl, stage, javaCode } = req.body || {};

      if (!name) {
        return res.status(400).json({ error: "Project name is required" });
      }

      const project = await prisma.project.create({
        data: {
          name,
          repoUrl: repoUrl || "",
          stage: stage || "core_audit",
          readinessScore: 85,
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
                    whatChanges: "Upgrade bytecode & convert REST controller logic to Axum router",
                    why: "Modernize Java application to Rust Tokio runtime",
                    targetPattern: `pub struct ${name.replace(/[^a-zA-Z0-9_]/g, "")}Handler {\n    pub status: String,\n}`,
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

      return res.status(201).json(project);
    } catch (error) {
      console.error("POST /api/projects error:", error);
      return res.status(500).json({ error: "Failed to create project" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
