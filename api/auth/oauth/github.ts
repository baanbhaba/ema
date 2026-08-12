import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "node:crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "GitHub OAuth not configured" });
  }

  const state = randomBytes(16).toString("hex");
  // In a real app, set this state in a secure HttpOnly cookie to verify in callback
  res.setHeader("Set-Cookie", `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`);

  const redirectUri = encodeURIComponent(`${process.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/v1/auth/oauth/callback`);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=user:email`;

  return res.redirect(githubAuthUrl);
}
