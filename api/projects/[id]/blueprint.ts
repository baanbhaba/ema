import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  // GET /api/v1/projects/:id/blueprint
  if (req.method === "GET") {
    try {
      const blueprint = await prisma.blueprint.findUnique({
        where: { projectId: id },
        include: {
          steps: { orderBy: { stepNumber: "asc" } },
        },
      });

      if (!blueprint) {
        return res.status(404).json({ error: "Blueprint not found for this project" });
      }

      // Map DB shape to frontend contract shape
      const mapped = {
        project_id: id,
        steps: blueprint.steps.map((s: any) => ({
          id: s.id,
          file_or_module: s.fileOrModule,
          what_changes: s.whatChanges,
          why: s.why,
          target_pattern: s.targetPattern,
          risk_level: s.riskLevel,
          depends_on: s.dependsOn,
          status: s.status,
          rejection_reason: s.rejectionReason ?? undefined,
        })),
      };

      return res.status(200).json(mapped);
    } catch (error) {
      console.error(`GET /api/projects/${id}/blueprint error:`, error);
      return res.status(500).json({ error: "Failed to fetch blueprint" });
    }
  }

  // POST /api/v1/projects/:id/blueprint/approve-all
  // (handled via vercel.json rewrite to this file won't work for sub-paths;
  //  this endpoint handles approve-all if path suffix indicates it)
  if (req.method === "POST") {
    try {
      const blueprint = await prisma.blueprint.findUnique({
        where: { projectId: id },
        include: { steps: true },
      });

      if (!blueprint) {
        return res.status(404).json({ error: "Blueprint not found" });
      }

      await prisma.blueprintStep.updateMany({
        where: { blueprintId: blueprint.id },
        data: { status: "approved" },
      });

      const updated = await prisma.blueprint.findUnique({
        where: { projectId: id },
        include: { steps: { orderBy: { stepNumber: "asc" } } },
      });

      const mapped = {
        project_id: id,
        steps: (updated?.steps ?? []).map((s: any) => ({
          id: s.id,
          file_or_module: s.fileOrModule,
          what_changes: s.whatChanges,
          why: s.why,
          target_pattern: s.targetPattern,
          risk_level: s.riskLevel,
          depends_on: s.dependsOn,
          status: s.status,
          rejection_reason: s.rejectionReason ?? undefined,
        })),
      };

      return res.status(200).json(mapped);
    } catch (error) {
      console.error(`POST /api/projects/${id}/blueprint error:`, error);
      return res.status(500).json({ error: "Failed to approve all steps" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
