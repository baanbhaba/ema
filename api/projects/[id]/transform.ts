import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { generateRustCodeFromJava } from "../../../src/api/transform";
import { refreshProjectReadiness } from "../../lib/auditMapping";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  if (req.method === "POST") {
    try {
      const { stepId } = req.body || {};

      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          uploadedSources: true,
          blueprint: { include: { steps: true } },
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const primarySource = project.uploadedSources[0];
      const rawJavaCode = primarySource ? primarySource.rawCode : "public class Main {}";

      const targetRustCode = generateRustCodeFromJava(rawJavaCode, stepId || "step-1");

      const transformation = await prisma.transformation.create({
        data: {
          projectId: id,
          stepId: stepId || null,
          status: "completed",
          rawJavaCode,
          transformedRustCode: targetRustCode,
          modelUsed: "meta/llama-3.1-70b-instruct",
        },
      });

      if (stepId && project.blueprint) {
        await prisma.blueprintStep.update({
          where: { id: stepId },
          data: {
            targetPattern: targetRustCode,
            status: "approved",
          },
        }).catch(() => null);
      }

      const readiness = await refreshProjectReadiness(id);

      await prisma.project.update({
        where: { id },
        data: {
          stage: "blueprint",
          readinessScore: readiness?.overall ?? project.readinessScore ?? 85,
        },
      });

      return res.status(200).json({
        step_id: stepId || "step-1",
        transformed_code: targetRustCode,
        status: "completed",
        transformation_id: transformation.id,
      });
    } catch (error) {
      console.error(`POST /api/projects/${id}/transform error:`, error);
      return res.status(500).json({ error: "Failed to execute transformation" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
