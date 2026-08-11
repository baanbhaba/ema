import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { normalizeCoreAudit, normalizeImpactAudit } from "../../../src/server/auditMapping";

/**
 * GET /api/v1/projects/:id/audit
 * Returns the combined { core, impact } audit pair for a project.
 * Used by the Pipeline Views to check audit status in one round trip.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

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

    const core = normalizeCoreAudit(project.coreAudit);
    const impact = normalizeImpactAudit(project.impactAudit);

    return res.status(200).json({ core, impact });
  } catch (error) {
    console.error(`GET /api/projects/${id}/audit error:`, error);
    return res.status(500).json({ error: "Failed to fetch audit data" });
  }
}
