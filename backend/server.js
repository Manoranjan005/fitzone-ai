import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import chatRouter from "./routes/chat.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

if (!process.env.OPENROUTER_API_KEY) {
  console.error(
    "ERROR: OPENROUTER_API_KEY is not set. Copy backend/.env.example to backend/.env and add your free key from https://openrouter.ai/keys"
  );
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN.split(",").map((o) => o.trim()),
  })
);
app.use(express.json({ limit: "100kb" }));

// Basic rate limiting: 30 requests per minute per IP.
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many messages sent — please wait a moment before trying again.",
  },
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "FitZone AI backend" });
});

app.use("/api", chatLimiter, chatRouter);

// Fallback error handler for anything unexpected.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`FitZone AI backend running on http://localhost:${PORT}`);
});
