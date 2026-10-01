import { Router } from "express";
import { getCoachReply } from "../services/openrouterService.js";
import { isFitnessRelated, REJECTION_MESSAGE } from "../services/domainFilter.js";

const router = Router();

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;

function validateBody(body) {
  if (!body || typeof body !== "object") return "Request body is missing.";
  if (typeof body.message !== "string" || body.message.trim().length === 0) {
    return "`message` is required and must be a non-empty string.";
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return `\`message\` must be under ${MAX_MESSAGE_LENGTH} characters.`;
  }
  if (body.history !== undefined) {
    if (!Array.isArray(body.history)) return "`history` must be an array.";
    for (const turn of body.history) {
      if (
        !turn ||
        typeof turn !== "object" ||
        !["user", "assistant"].includes(turn.role) ||
        typeof turn.content !== "string"
      ) {
        return "Each `history` item must be { role: 'user'|'assistant', content: string }.";
      }
    }
  }
  return null;
}

router.post("/chat", async (req, res) => {
  try {
    const validationError = validateBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { message } = req.body;
    const history = (req.body.history || []).slice(-MAX_HISTORY_MESSAGES);

    // Domain restriction applies to EVERY message, including follow-ups.
    const allowed = await isFitnessRelated(history, message);
    if (!allowed) {
      return res.json({ reply: REJECTION_MESSAGE, blocked: true });
    }

    const messages = [...history, { role: "user", content: message }];
    const reply = await getCoachReply(messages);

    return res.json({ reply, blocked: false });
  } catch (err) {
    console.error("Chat route error:", err);
    return res.status(502).json({
      error:
        "FitZone AI couldn't reach the coaching service right now. Please try again in a moment.",
    });
  }
});

export default router;
