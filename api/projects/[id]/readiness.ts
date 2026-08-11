import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { calculateReadinessScore } from "../../../src/lib/analysis";
import { normalizeCoreAudit, normalizeImpactAudit } from "../../lib/auditMapping";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  if (req.method === "GET") {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          coreAudit: true,
          impactAudit: true,
          blueprint: { include: { steps: true } },
          readinessAssessment: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const coreAudit = normalizeCoreAudit(project.coreAudit);
      const impactAudit = normalizeImpactAudit(project.impactAudit);
      const blueprint = project.blueprint
        ? {
            project_id: id,
            steps: project.blueprint.steps.map((s: any) => ({
              id: s.id,
              status: s.status,
            })),
          }
        : null;

      const readiness = calculateReadinessScore(coreAudit, impactAudit, blueprint);

      await prisma.project.update({
        where: { id },
        data: { readinessScore: readiness.overall },
      }).catch(() => null);

      return res.status(200).json(readiness);
    } catch (error) {
      console.error(`GET /api/projects/${id}/readiness error:`, error);
      return res.status(500).json({ error: "Failed to fetch readiness score" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
