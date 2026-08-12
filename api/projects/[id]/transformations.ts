import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { authorizeTenant } from "../../utils/tenant";

/**
 * GET  /api/v1/projects/:id/transformations
 *      Returns all transformations for a project (for cache hydration & report generation).
 *
 * GET  /api/v1/projects/:id/transformations/:stepId
 *      Returns a single transformation by stepId (for cache lookup on miss).
 *
 * POST /api/v1/projects/:id/transformations
 *      Persists a new transformation result. Upserts by (projectId, stepId).
 *      Also updates the matching BlueprintStep.targetPattern if stepId is provided.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, stepId } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing project id" });
  }

  const auth = await authorizeTenant(req, res, id);
  if (!auth) return;

  try {
    // ── GET all transformations ───────────────────────────────────────────────
    if (req.method === "GET" && !stepId) {
      const transformations = await prisma.transformation.findMany({
        where: { projectId: id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stepId: true,
          rawJavaCode: true,
          transformedRustCode: true,
          modelUsed: true,
          status: true,
          createdAt: true,
        },
      });
      return res.status(200).json(transformations);
    }

    // ── GET single transformation by stepId ───────────────────────────────────
    if (req.method === "GET" && stepId && typeof stepId === "string") {
      const transformation = await prisma.transformation.findFirst({
        where: { projectId: id, stepId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stepId: true,
          rawJavaCode: true,
          transformedRustCode: true,
          modelUsed: true,
          status: true,
          createdAt: true,
        },
      });

      if (!transformation) {
        return res.status(404).json({ error: "Transformation not found" });
      }

      return res.status(200).json(transformation);
    }

    // ── POST — upsert transformation ──────────────────────────────────────────
    if (req.method === "POST") {
      const { stepId: bodyStepId, rawJavaCode, transformedRustCode, modelUsed } = req.body || {};

      if (!transformedRustCode) {
        return res.status(400).json({ error: "transformedRustCode is required" });
      }

      // Upsert: if a transformation for this (projectId, stepId) already exists, update it.
      // This prevents duplicate rows from retry calls.
      let transformation;

      if (bodyStepId) {
        const existing = await prisma.transformation.findFirst({
          where: { projectId: id, stepId: bodyStepId },
          orderBy: { createdAt: "desc" },
        });

        if (existing) {
          transformation = await prisma.transformation.update({
            where: { id: existing.id },
            data: {
              rawJavaCode: rawJavaCode ?? existing.rawJavaCode,
              transformedRustCode,
              modelUsed: modelUsed ?? "meta/llama-3.1-70b-instruct",
              status: "completed",
            },
          });
        } else {
          transformation = await prisma.transformation.create({
            data: {
              projectId: id,
              stepId: bodyStepId,
              rawJavaCode: rawJavaCode ?? "",
              transformedRustCode,
              modelUsed: modelUsed ?? "meta/llama-3.1-70b-instruct",
              status: "completed",
            },
          });
        }

        // Also update the matching BlueprintStep.targetPattern in the same transaction
        await prisma.blueprintStep.updateMany({
          where: { id: bodyStepId },
          data: { targetPattern: transformedRustCode },
        }).catch(() => null);
      } else {
        transformation = await prisma.transformation.create({
          data: {
            projectId: id,
            rawJavaCode: rawJavaCode ?? "",
            transformedRustCode,
            modelUsed: modelUsed ?? "meta/llama-3.1-70b-instruct",
            status: "completed",
          },
        });
      }

      // Update project stage to indicate it has transformed code available
      await prisma.project.update({
        where: { id },
        data: { stage: "blueprint" },
      }).catch(() => null);

      return res.status(201).json(transformation);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error(`[/api/projects/${id}/transformations] Error:`, error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error?.message,
    });
  }
}
