import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { mapProjectToSummary } from "../../../src/server/projectMapping";

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
          uploadedSources: true,
          coreAudit: true,
          impactAudit: true,
          readinessAssessment: true,
          blueprint: {
            include: {
              steps: {
                orderBy: { stepNumber: "asc" },
              },
            },
          },
          transformations: {
            orderBy: { createdAt: "desc" },
          },
          migrationReport: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const mapped = mapProjectToSummary(project);
      return res.status(200).json({
        ...mapped,
        uploaded_sources: project.uploadedSources,
        core_audit: project.coreAudit,
        impact_audit: project.impactAudit,
        readiness_assessment: project.readinessAssessment,
        blueprint: project.blueprint,
        transformations: project.transformations,
        migration_report: project.migrationReport,
      });
    } catch (error) {
      console.error(`GET /api/projects/${id} error:`, error);
      return res.status(500).json({ error: "Failed to fetch project details" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.project.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(`DELETE /api/projects/${id} error:`, error);
      return res.status(500).json({ error: "Failed to delete project" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

