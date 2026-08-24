import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth API endpoint - use App Router auth instead
  res.status(200).json({ message: "Use App Router authentication" });
}
