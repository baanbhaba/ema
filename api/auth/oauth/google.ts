import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "node:crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Method Not Allowed");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "Google OAuth not configured" });
  }

  const state = randomBytes(16).toString("hex");
  res.setHeader("Set-Cookie", `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=300`);

  const redirectUri = encodeURIComponent(`${process.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/auth/oauth/callback`);
  const scope = encodeURIComponent("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline`;

  return res.redirect(googleAuthUrl);
}
