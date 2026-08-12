import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";
import { authorizeTenant } from "../utils/tenant";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authorizeTenant(req, res);
  if (!auth) return;

  if (req.method === "GET") {
    try {
      const orgs = await prisma.organization.findMany({
        where: auth.isSuperDev ? undefined : {
          members: {
            some: { userId: auth.user.id }
          }
        },
        include: {
          _count: { select: { projects: true, members: true } }
        },
        orderBy: { createdAt: "desc" }
      });
      return res.status(200).json(orgs);
    } catch (error) {
      console.error("GET /api/organizations error:", error);
      return res.status(500).json({ error: "Failed to fetch organizations" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, slug } = req.body || {};
      if (!name || !slug) {
        return res.status(400).json({ error: "Name and slug are required" });
      }

      const org = await prisma.organization.create({
        data: {
          name,
          slug,
          members: {
            create: {
              userId: auth.user.id,
              role: "ADMIN",
            }
          }
        }
      });
      return res.status(201).json(org);
    } catch (error) {
      console.error("POST /api/organizations error:", error);
      return res.status(500).json({ error: "Failed to create organization" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
