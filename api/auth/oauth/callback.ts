import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";
import { randomUUID } from "node:crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  // 1. Exchange code for access token
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "GitHub OAuth not configured" });
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData: any = await tokenRes.json();
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser: any = await userRes.json();

    // 3. Upsert user in database
    const email = githubUser.email || `${githubUser.login}@github.local`;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: githubUser.login,
          passwordHash: "oauth", // Not used for OAuth
          role: "developer",
        },
      });
    }

    // 4. Return or redirect with session token
    const token = `alchemi-${randomUUID()}`;
    // Redirect to frontend with token in fragment or cookie
    res.setHeader("Set-Cookie", `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
    const frontendUrl = process.env.VITE_APP_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/oauth/success?token=${token}&username=${user.username}&role=${user.role}`);
  } catch (err: any) {
    console.error("OAuth callback error:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
}
