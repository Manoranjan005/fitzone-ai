# FitZone AI 🏋️‍♂️

**Your personal AI fitness coach — workouts, strength training, fat loss, and fitness nutrition, in a dark neon-lime chat interface.**

FitZone AI answers fitness questions only. Anything off-topic is declined on the backend, so the restriction can't be bypassed from the browser or talked around mid-conversation.

![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Powered by](https://img.shields.io/badge/powered%20by-OpenRouter-6366F1)

---

## ✨ Features

- 💬 Multi-turn chat with a warm, coach-like personality
- 🚫 Strict fitness-only domain filter (keyword pass + AI classification gate on the backend)
- 🏋️ Personalized guidance based on goal, experience level, location, and equipment
- 📋 Structured workout plans with sets, reps, and rest intervals
- ⚡ Quick-start suggestion cards for common questions
- 🔒 API key kept server-side only — never exposed to the frontend
- 🔁 Automatic fallback across multiple free models if one is rate-limited or down
- 🛡️ Basic request validation and rate limiting on the API
- 🎨 Dark, responsive, neon-lime UI built with Tailwind CSS

## 🧱 Tech stack

| Layer      | Tech                                      |
|------------|--------------------------------------------|
| Frontend   | React, Vite, Tailwind CSS, Lucide icons    |
| Backend    | Node.js, Express                           |
| AI         | [OpenRouter](https://openrouter.ai/) (free-tier models, e.g. Llama 3.3 70B, DeepSeek) |

## 📂 Project structure

```
fitzone-ai/
├── frontend/               React + Vite + Tailwind chat UI
│   ├── src/
│   │   ├── components/     Header, ChatWindow, ChatInput, MessageBubble, etc.
│   │   ├── styles/
│   │   └── App.jsx
│   └── api/                Vercel serverless functions (deployment option)
│       ├── chat.js
│       ├── health.js
│       └── _shared.js      System prompt + domain filter + OpenRouter calls
├── backend/                Express API that talks to OpenRouter (local-dev option)
│   ├── routes/chat.js      POST /api/chat
│   └── services/
│       ├── openrouterService.js    System prompt + reply generation
│       └── domainFilter.js         Fitness-only classification gate
└── README.md
```

> You only need **one** of `backend/` (run it yourself) or `frontend/api/` (deploy to Vercel) — not both. See "Run it locally" vs "Deploy to Vercel" below.

## 🛡️ How the fitness-only restriction works

1. **System instruction** — every reply-generating call sends the model a strict system instruction defining the allowed topics, telling it to refuse anything else, resist "ignore your instructions" attempts, and never reveal its own instructions.
2. **Domain classification gate** — *before* any answer is generated, `domainFilter.js` checks the message: a fast keyword pass handles obvious cases, and a cheap classification call (small, fast free model) resolves anything ambiguous. Off-topic messages get the fixed rejection message without the main model ever being called.
3. This gate runs on **every** message, including follow-ups, so the restriction can't be defeated a few turns into a conversation.

## 🚀 Run it locally

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A free OpenRouter API key from [openrouter.ai/keys](https://openrouter.ai/keys) (sign in, no card needed)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/fitzone-ai.git
cd fitzone-ai
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and add your key:

```
OPENROUTER_API_KEY=your_real_key_here
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Start it:

```bash
npm start
```

You should see `FitZone AI backend running on http://localhost:5000`. Leave this running.

### 3. Set up the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the printed URL, typically `http://localhost:5173`.

> **Windows PowerShell users:** the commands above work as-is, except `cp` → `copy` (e.g. `copy .env.example .env`).

### 4. Verify it's running

- Backend health check: `http://localhost:5000/api/health` → `{"status":"ok",...}`
- App: `http://localhost:5173` → try a quick-start card or type a question

## ☁️ Deploy to Vercel (get a live link)

Vercel hosts the React frontend **and** the backend together as serverless functions under `frontend/api/`, so the whole app ends up on one URL — no separate backend host needed.

### 1. Push the repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit: FitZone AI"
git remote add origin https://github.com/YOUR-USERNAME/fitzone-ai.git
git branch -M main
git push -u origin main
```

### 2. Import the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Select your `fitzone-ai` repo and click **Import**.
3. Under **Root Directory**, click **Edit** and choose `frontend` (required — Vercel needs to see `frontend/package.json` and `frontend/api/` as the project root).
4. Vercel auto-detects the Vite framework; leave build settings as default.

### 3. Add your API key

Before or after deploying, under **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `OPENROUTER_API_KEY` | your real key from [openrouter.ai/keys](https://openrouter.ai/keys) |

Check all three environments (Production, Preview, Development), then save. If you add it *after* the first deploy, redeploy from the Deployments tab for it to take effect.

### 4. Deploy

Click **Deploy**. After a minute or two you'll get a live link like `https://fitzone-ai-yourname.vercel.app`.

Every future `git push` to `main` auto-redeploys; other branches get their own preview link.

## ⚙️ Configuration reference

| Variable             | Where               | Purpose                                              |
|------------------------|----------------------|-------------------------------------------------------|
| `OPENROUTER_API_KEY`  | `backend/.env` or Vercel env vars | Your free OpenRouter API key. Never commit this. |
| `PORT`                | `backend/.env`        | Backend port (default `5000`), local dev only.       |
| `CORS_ORIGIN`         | `backend/.env`        | Comma-separated allowed frontend origins, local dev only. |

## 🆓 About the free tier

This project uses OpenRouter's free-tier models (IDs ending `:free`), listing a primary model plus fallbacks for both the coaching replies and the domain classifier — if one free model is rate-limited or temporarily down, OpenRouter automatically tries the next. Free models do rotate over time as providers adjust their offerings; check [openrouter.ai/models?fmt=free](https://openrouter.ai/models?fmt=free) for the current list and update the model IDs in `openrouterService.js` / `_shared.js` if one stops working. See [openrouter.ai/docs](https://openrouter.ai/docs) for current rate limits.

## 🏥 Safety & scope notes

- Never diagnoses injuries or medical conditions, never promises guaranteed results.
- Tells users reporting chest pain, fainting, or difficulty breathing to stop exercising and seek urgent medical care.
- Rate limiting (30 req/min/IP) and request validation live in `backend/server.js` and `backend/routes/chat.js` for local runs.

## 📦 Production notes (self-hosted backend)

If running `backend/` yourself in production rather than using Vercel:
- Build the frontend (`npm run build` in `frontend/`) and serve `dist/` from a static host or CDN, updating `CORS_ORIGIN` to your real domain.
- Run the backend behind a process manager (`pm2`) or container, with `OPENROUTER_API_KEY` set as a real secret on your host.
- Consider a stricter, Redis-backed rate limiter for meaningful production traffic.

## 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

## 📄 License

[MIT](LICENSE)
