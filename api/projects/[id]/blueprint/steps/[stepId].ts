import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../../../src/lib/prisma";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, stepId, action } = req.query;

  if (!id || typeof id !== "string" || !stepId || typeof stepId !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id or step id" });
  }

  // POST /api/v1/projects/:id/blueprint/steps/:stepId/approve
  if (req.method === "POST" && action === "approve") {
    try {
      const step = await prisma.blueprintStep.update({
        where: { id: stepId },
        data: { status: "approved", rejectionReason: null },
      });

      return res.status(200).json({
        id: step.id,
        file_or_module: step.fileOrModule,
        what_changes: step.whatChanges,
        why: step.why,
        target_pattern: step.targetPattern,
        risk_level: step.riskLevel,
        depends_on: step.dependsOn,
        status: step.status,
        rejection_reason: step.rejectionReason ?? undefined,
      });
    } catch (error) {
      console.error(`POST /api/projects/${id}/blueprint/steps/${stepId}/approve error:`, error);
      return res.status(500).json({ error: "Failed to approve step" });
    }
  }

  // POST /api/v1/projects/:id/blueprint/steps/:stepId/reject
  if (req.method === "POST" && action === "reject") {
    try {
      const { reason } = req.body || {};
      if (!reason) {
        return res.status(400).json({ error: "Rejection reason is required" });
      }
      const step = await prisma.blueprintStep.update({
        where: { id: stepId },
        data: { status: "rejected", rejectionReason: reason },
      });

      return res.status(200).json({
        id: step.id,
        file_or_module: step.fileOrModule,
        what_changes: step.whatChanges,
        why: step.why,
        target_pattern: step.targetPattern,
        risk_level: step.riskLevel,
        depends_on: step.dependsOn,
        status: step.status,
        rejection_reason: step.rejectionReason ?? undefined,
      });
    } catch (error) {
      console.error(`POST /api/projects/${id}/blueprint/steps/${stepId}/reject error:`, error);
      return res.status(500).json({ error: "Failed to reject step" });
    }
  }

  // PATCH /api/v1/projects/:id/blueprint/steps/:stepId
  if (req.method === "PATCH") {
    try {
      const patch = req.body || {};
      const updateData: Record<string, unknown> = {};
      if (patch.status !== undefined) updateData.status = patch.status;
      if (patch.target_pattern !== undefined) updateData.targetPattern = patch.target_pattern;
      if (patch.rejection_reason !== undefined) updateData.rejectionReason = patch.rejection_reason;

      const step = await prisma.blueprintStep.update({
        where: { id: stepId },
        data: updateData,
      });

      return res.status(200).json({
        id: step.id,
        file_or_module: step.fileOrModule,
        what_changes: step.whatChanges,
        why: step.why,
        target_pattern: step.targetPattern,
        risk_level: step.riskLevel,
        depends_on: step.dependsOn,
        status: step.status,
        rejection_reason: step.rejectionReason ?? undefined,
      });
    } catch (error) {
      console.error(`PATCH /api/projects/${id}/blueprint/steps/${stepId} error:`, error);
      return res.status(500).json({ error: "Failed to update step" });
    }
  }

  res.setHeader("Allow", ["POST", "PATCH"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
