import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { calculateConsensus } from "../../../src/lib/analysis";
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
          uploadedSources: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const coreAudit = normalizeCoreAudit(project.coreAudit);
      const impactAudit = normalizeImpactAudit(project.impactAudit);
      const primaryFile = project.uploadedSources[0]?.fileName || `${project.name}.java`;

      const consensus = calculateConsensus(coreAudit, impactAudit, primaryFile);

      return res.status(200).json(consensus);
    } catch (error) {
      console.error(`GET /api/projects/${id}/consensus error:`, error);
      return res.status(500).json({ error: "Failed to fetch consensus result" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
