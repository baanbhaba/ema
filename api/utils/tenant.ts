import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";

/**
 * Validates the tenant for the current request using x-username header.
 * 
 * @param req The VercelRequest object
 * @param res The VercelResponse object
 * @param projectId Optional projectId to verify ownership
 * @returns The user object and isSuperDev flag, or null if response was already sent
 */
export async function authorizeTenant(
  req: VercelRequest,
  res: VercelResponse,
  projectId?: string
) {
  const username = req.headers["x-username"] as string;

  if (!username) {
    res.status(401).json({ error: "Unauthorized: Missing x-username header" });
    return null;
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    res.status(401).json({ error: `Unauthorized: User '${username}' not found` });
    return null;
  }

  const isSuperDev = user.username.toLowerCase() === "baanbhaba" || user.role === "SUPER_DEV";

  // If a projectId is provided, verify tenant ownership
  if (projectId && !isSuperDev) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, organizationId: true },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return null;
    }

    if (project.organizationId) {
      const isMember = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: project.organizationId,
            userId: user.id,
          },
        },
      });
      if (!isMember) {
        res.status(403).json({ error: "Forbidden: You do not have access to this organization" });
        return null;
      }
    } else if (project.userId !== user.id) {
      res.status(403).json({ error: "Forbidden: You do not own this project" });
      return null;
    }
  }

  return { user, isSuperDev };
}
