// api/health.js — becomes GET /api/health
export default function handler(req, res) {
  res.status(200).json({ status: "ok", service: "FitZone AI (Vercel)" });
}
