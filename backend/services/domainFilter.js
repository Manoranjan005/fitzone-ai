// domainFilter.js
// Two-layer defense so off-topic messages are rejected BEFORE the main
// answer-generating call is ever made:
//   1. A fast local keyword/heuristic pass (cheap, catches obvious cases).
//   2. An AI classification call (cheap, small max_tokens) for anything
//      the heuristic pass can't confidently decide.

import { CLASSIFIER_MODELS, callOpenRouter } from "./openrouterService.js";

export const REJECTION_MESSAGE =
  "Sorry, that's not my field! I'm FitZone AI, your personal fitness assistant. " +
  "I can help you with workouts, muscle building, fat loss, exercise routines, and " +
  "fitness-related nutrition. Ask me anything about fitness!";

const FITNESS_KEYWORDS = [
  "workout", "exercise", "gym", "muscle", "strength", "cardio", "hiit",
  "yoga", "stretch", "flexib", "protein", "calorie", "diet", "nutrition",
  "fat loss", "weight loss", "weight gain", "bulk", "cut", "abs", "core",
  "squat", "deadlift", "bench", "press", "rep", "set", "training", "trainer",
  "fitness", "run", "running", "jog", "cycling", "swim", "plank",
  "recovery", "rest day", "sleep", "sore", "soreness", "injury", "warm up",
  "warmup", "cool down", "stamina", "endurance", "bicep", "tricep", "glute",
  "hamstring", "quad", "shoulder", "chest day", "leg day", "hydration",
  "supplement", "creatine", "bmi", "body fat", "tone", "toning", "posture",
  "mobility", "pushup", "push-up", "pull-up", "pullup", "lunge",
  "treadmill", "dumbbell", "barbell", "kettlebell", "resistance band",
  "home workout", "gym routine", "workout plan", "fitness goal"
];

const OBVIOUSLY_OFF_TOPIC = [
  "code", "programming", "python", "javascript", "react", "html", "css",
  "politic", "president", "election", "movie", "tv show", "netflix",
  "history of", "capital of", "math homework", "algebra", "calculus",
  "stock market", "cryptocurrency", "bitcoin", "recipe for", "song lyrics",
  "write me a poem", "joke", "who is the", "what is the weather"
];

function normalize(text) {
  return text.toLowerCase();
}

/**
 * Fast local pass. Returns:
 *   "fitness"    -> confidently in-domain, skip AI classification
 *   "off-topic"  -> confidently out of domain, skip AI classification
 *   "ambiguous"  -> let the AI classifier decide
 */
function heuristicPass(message) {
  const text = normalize(message);

  const hasFitnessKeyword = FITNESS_KEYWORDS.some((kw) => text.includes(kw));
  const hasOffTopicKeyword = OBVIOUSLY_OFF_TOPIC.some((kw) => text.includes(kw));

  if (hasFitnessKeyword && !hasOffTopicKeyword) return "fitness";
  if (hasOffTopicKeyword && !hasFitnessKeyword) return "off-topic";
  return "ambiguous";
}

const CLASSIFIER_SYSTEM_PROMPT = `You are a strict binary classifier for FitZone AI, a fitness-only chatbot.

Decide whether the user's LATEST message (considering the recent conversation for context, e.g. follow-ups) is about one of these fitness topics:
workouts, exercise routines, muscle building, strength training, fat loss, weight management, cardio, HIIT, yoga, stretching, flexibility, recovery, rest, sleep as it relates to fitness, fitness nutrition (protein, carbs, hydration, balanced eating for fitness goals), fitness equipment, workout scheduling, personalized fitness plans, or fitness motivation/consistency.

Reply with ONLY one word, nothing else:
"FITNESS" if it is genuinely about one of these topics (including a reasonable follow-up to an earlier fitness answer, or a short clarifying reply like "beginner" or "home" when the assistant just asked about fitness preferences).
"OFF_TOPIC" if it is not, or if it only mentions fitness words in a weak/artificial way to smuggle in an unrelated request (e.g. "write me a Python script to log workouts" is OFF_TOPIC because the real ask is coding).`;

/**
 * Uses OpenRouter (a cheap, fast free model) to classify ambiguous messages.
 * @param {Array<{role: string, content: string}>} recentHistory
 * @param {string} message
 */
async function aiClassify(recentHistory, message) {
  try {
    const contextSnippet = recentHistory
      .slice(-4)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const content = await callOpenRouter({
      models: CLASSIFIER_MODELS,
      messages: [
        { role: "system", content: CLASSIFIER_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Recent conversation:\n${contextSnippet}\n\nLatest message: "${message}"`,
        },
      ],
      maxTokens: 5,
    });

    return content.trim().toUpperCase().includes("FITNESS");
  } catch (err) {
    // If the classifier call itself fails, fail closed on the side of
    // letting the heuristic decide rather than blocking everything.
    console.error("Domain classifier error:", err.message);
    return true;
  }
}

/**
 * Main entry point. Returns true if the message should be answered,
 * false if the rejection message should be returned instead.
 */
export async function isFitnessRelated(recentHistory, message) {
  const verdict = heuristicPass(message);
  if (verdict === "fitness") return true;
  if (verdict === "off-topic") return false;
  return aiClassify(recentHistory, message);
}
