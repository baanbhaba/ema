import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/lib/prisma";
import { authorizeTenant } from "../utils/tenant";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await authorizeTenant(req, res);
  if (!auth) return;

  const { user } = auth;

  try {
    if (req.method === "GET") {
      let prefs = await prisma.userPreference.findUnique({
        where: { userId: user.id },
      });

      if (!prefs) {
        prefs = await prisma.userPreference.create({
          data: { userId: user.id }
        });
      }
      return res.status(200).json({ success: true, preferences: prefs, devApiKey: user.devApiKey });
    }

    if (req.method === "PATCH") {
      const { theme, aiModel, defaultReviewMode, notificationsEnabled, devApiKey } = req.body || {};
      
      const prefs = await prisma.userPreference.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          theme: theme ?? "dark",
          aiModel: aiModel ?? "meta/llama-3.1-70b-instruct",
          defaultReviewMode: defaultReviewMode ?? "strict",
          notificationsEnabled: notificationsEnabled ?? true,
        },
        update: {
          ...(theme !== undefined && { theme }),
          ...(aiModel !== undefined && { aiModel }),
          ...(defaultReviewMode !== undefined && { defaultReviewMode }),
          ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        }
      });

      if (devApiKey !== undefined) {
        await prisma.user.update({
          where: { id: user.id },
          data: { devApiKey },
        });
      }

      return res.status(200).json({ success: true, preferences: prefs, devApiKey });
    }

    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).end("Method Not Allowed");
  } catch (error) {
    console.error("API Error /api/user/preferences:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
