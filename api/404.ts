import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(404).json({
    error: "API endpoint not found",
    message: `The requested path '${req.url}' does not exist on this server.`,
    status: 404,
    timestamp: new Date().toISOString(),
  });
}
