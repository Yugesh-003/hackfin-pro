# FinMentor AI

> **"Don't just tell users how they spend. Teach them why it matters, how to improve, and guide them until better financial habits become second nature."**

FinMentor AI is an AI-powered financial literacy platform that transforms your real bank transactions into a **personalized learning journey**. It analyzes your spending habits, identifies your weakest financial areas, builds a custom lesson roadmap, validates your understanding with quizzes, and mentors you one-on-one using an AI chat coach.

This is an **educational application** — not a budgeting app, not a banking app. Financial data is used only to personalize your learning.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [How It Works](#how-it-works)
- [Build for Production](#build-for-production)
- [Troubleshooting](#troubleshooting)

---

## Features

### 🔐 Authentication
- Email + password sign-up and login via Firebase Auth
- Protected routes — unauthenticated users are automatically redirected to login

### 💳 Transaction Import
- **CSV upload** — drag-and-drop or file picker with a downloadable template
- **Excel upload** — `.xlsx` / `.xls` files using the same template format
- **Manual entry** — add individual transactions with a form (date, description, category, amount, type)
- Smart category normalization — recognizes 50+ common category names (Zomato → food_dining, Netflix → subscriptions, etc.)

### 📊 Financial Analysis Engine *(100% rule-based, zero AI)*
- Monthly income & expenses
- Savings rate, cash flow
- Spending breakdown by category (with percentages)
- Subscription spend, debt/EMI spend
- Emergency fund estimation
- Financial Health Score (0–100) across 5 dimensions: savings rate, debt ratio, emergency fund, investment rate, subscription load
- Personalized financial observations (warnings, positives, tips)

### 📚 Personalized Learning Roadmap
- Lesson order is determined by your financial weaknesses, not a fixed curriculum
- 10 curated financial literacy lessons covering:
  - Budgeting & Spending
  - Smart Saving
  - Emergency Fund
  - Debt Management
  - Investing Basics
  - Financial Goal Planning
  - Insurance Essentials
  - Digital Payments & Safety
  - Spending Psychology
  - Becoming Financially Independent
- Lessons unlock sequentially after passing each quiz

### 🤖 AI-Personalized Lessons *(Groq / Llama 3.3-70b)*
- Every lesson includes a **personalized insight** connecting lesson content to your specific financial data
- A **personalized action** you can take this week, based on your real situation
- AI runs server-side only — your API key never reaches the browser

### ✅ Quiz Engine
- 2 questions per lesson with 4 multiple-choice options
- Instant answer feedback with explanations
- Pass/fail logic (≥ 50% to pass)
- Failed attempts show wrong answers with explanations + retry option
- Passing unlocks the next lesson

### 💬 AI Mentor Chat *(Groq / Llama 3.3-70b)*
- Contextual chat — the AI knows your financial profile and lesson history
- Starter questions to get the conversation going
- Typing indicator, conversation history (last 10 messages)
- Runs server-side only via TanStack Start server functions

### 📈 Progress Tracking
- Financial Literacy Score (0–1,000): lesson completion + quiz accuracy + streak + achievements
- Skill progress bars per topic
- Full lesson history with quiz scores and completion dates
- 10 achievement badges (unlocked/locked states)
- Learning streak tracking

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React + SSR) |
| **Language** | TypeScript 5.8 (strict mode) |
| **Routing** | TanStack Router (file-based) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Animations** | Motion (formerly Framer Motion) |
| **Authentication** | Firebase Auth |
| **Database** | Firestore |
| **AI / LLM** | Groq API — `llama-3.3-70b-versatile` |
| **CSV Parsing** | PapaParse |
| **Excel Parsing** | SheetJS (xlsx) |
| **State** | React Context + custom hooks |
| **Build Tool** | Vite 8 + Nitro |
| **Linting** | ESLint 9 + typescript-eslint |
| **Formatting** | Prettier |

---

## Folder Structure

```
hackfinn/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── app/                # App shell (sidebar, nav, protected route)
│   │   ├── landing/            # Landing page components (do not modify)
│   │   ├── shared/             # Reusable UI (PageHeader, StatCard, EmptyState)
│   │   └── ui/                 # shadcn/ui primitives
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx     # Firebase auth state provider
│   │
│   ├── data/
│   │   └── lessons.ts          # All 10 static lessons + 20 quiz questions
│   │
│   ├── engine/
│   │   ├── analysisEngine.ts   # Rule-based financial analysis → FinancialProfile
│   │   └── recommendationEngine.ts  # Maps weaknesses → ordered lesson roadmap
│   │
│   ├── hooks/
│   │   ├── useAuth.ts          # Firebase auth state
│   │   ├── useProgress.ts      # User progress + lesson completion
│   │   └── useTransactions.ts  # Transaction CRUD
│   │
│   ├── lib/
│   │   ├── auth.ts             # signIn, signUp, signOut helpers
│   │   ├── firebase.ts         # Firebase client SDK init (SSR-safe)
│   │   ├── firestore.ts        # Firestore CRUD operations
│   │   ├── groq.ts             # Groq API server functions (lesson AI + mentor)
│   │   ├── transactionParser.ts # CSV/Excel → Transaction[] normalizer
│   │   └── utils.ts            # cn() utility
│   │
│   ├── routes/
│   │   ├── __root.tsx          # Root layout (AuthProvider, QueryClient)
│   │   ├── index.tsx           # Landing page
│   │   ├── auth/
│   │   │   ├── login.tsx       # /auth/login
│   │   │   └── signup.tsx      # /auth/signup
│   │   └── app/
│   │       ├── route.tsx       # /app layout (ProtectedRoute + sidebar)
│   │       ├── dashboard.tsx   # /app/dashboard
│   │       ├── transactions.tsx # /app/transactions
│   │       ├── lessons.tsx     # /app/lessons (roadmap)
│   │       ├── lessons_.$lessonId.tsx # /app/lessons/:id (reader + AI insight)
│   │       ├── quiz.$lessonId.tsx     # /app/quiz/:id
│   │       ├── mentor.tsx      # /app/mentor (AI chat)
│   │       └── progress.tsx    # /app/progress
│   │
│   ├── types/
│   │   └── index.ts            # All domain types
│   │
│   ├── styles.css              # Global Tailwind design system
│   └── router.tsx              # Router configuration
│
├── .env.example                # Environment variable template
├── .env                        # Your credentials (never committed)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or later — [download](https://nodejs.org/)
- **npm** v9 or later (comes with Node.js)
- A **Firebase project** with Authentication (Email/Password) and Firestore enabled
- A **Groq API key** — [get one free](https://console.groq.com/)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/finmentor-ai.git
   cd finmentor-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) below)

---

## Environment Variables

Create a `.env` file in the project root by copying the example template:

```bash
cp .env.example .env
```

Then open `.env` and fill in your credentials:

```env
# Firebase — from your Firebase project settings → General → Your apps → Web app
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Groq — server-side only, never exposed to the browser
GROQ_API_KEY=your_groq_api_key_here
```

> **Important:** The `VITE_` prefix makes a variable available in the browser bundle. `GROQ_API_KEY` intentionally has **no** `VITE_` prefix — it is only used inside TanStack Start server functions and never sent to the client.

> **Security:** `.env` is listed in `.gitignore` and will never be committed to Git.

### Setting Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Enable **Firestore Database** → Start in test mode (or configure security rules)
4. Go to Project Settings → General → Your apps → Add a **Web app** → copy the config values into `.env`

---

## Running Locally

```bash
npm run dev
```

The app will start at **http://localhost:8080**

The first startup may take 10–30 seconds as Vite pre-bundles dependencies.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start the development server with HMR on :8080 |
| `build` | `npm run build` | Build for production (outputs to `.output/`) |
| `build:dev` | `npm run build:dev` | Build in development mode (for debugging) |
| `preview` | `npm run preview` | Preview the production build locally |
| `lint` | `npm run lint` | Run ESLint across all source files |
| `format` | `npm run format` | Auto-format all files with Prettier |

---

## How It Works

### User Journey

```
Landing Page
    ↓
Sign Up / Login (Firebase Auth)
    ↓
Add Transactions (CSV / Excel / Manual)
    ↓
Financial Analysis Engine (rule-based, instant)
    ↓
Personalized Learning Roadmap (weakest areas first)
    ↓
Lessons (static content + AI personalized insight via Groq)
    ↓
Quiz (must pass to unlock next lesson)
    ↓
Dashboard (scores, progress, observations)
    ↓
AI Mentor (contextual chat with your financial profile)
```

### How the Financial Health Score Works

The score (0–100) is computed from five pillars — all rule-based, no AI:

| Pillar | Points | Ideal |
|---|---|---|
| Savings rate | 0–30 | ≥ 20% of income |
| Debt/EMI ratio | 0–20 | < 30% of income |
| Emergency fund | 0–20 | ≥ 3 months of expenses |
| Investment rate | 0–15 | ≥ 10% of income |
| Subscription load | 0–15 | < 10% of expenses |

### How the Learning Roadmap Works

The recommendation engine maps financial weakness signals to lesson topics and sorts them by urgency. For example:
- Low savings rate → Budgeting + Smart Saving lessons first
- High debt/EMI → Debt Management lesson prioritized
- No investments detected → Investing Basics lesson moved up

### How AI Is Used (and Where It Isn't)

| Feature | AI? | Model |
|---|---|---|
| Financial analysis & scoring | ❌ Rule-based only | — |
| Learning roadmap order | ❌ Rule-based only | — |
| Lesson personalized insight | ✅ Server-side | Groq llama-3.3-70b |
| AI Mentor chat | ✅ Server-side | Groq llama-3.3-70b |

---

## Build for Production

```bash
npm run build
```

This uses **Nitro** to create an SSR-capable production bundle in `.output/`. The default deployment target is Cloudflare Workers (configured in `vite.config.ts` via `@lovable.dev/vite-tanstack-config`).

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## Troubleshooting

### The app shows a blank screen after sign-up

- Check your browser console for Firebase errors
- Make sure **Email/Password sign-in** is enabled in your Firebase project (Authentication → Sign-in method)
- Verify that all six `VITE_FIREBASE_*` variables in `.env` are filled in correctly

### AI mentor / lesson insights aren't loading

- Check that `GROQ_API_KEY` is set in your `.env` file (not `VITE_GROQ_API_KEY`)
- Verify the key is valid at [console.groq.com](https://console.groq.com/)
- The Groq API must be called server-side. If you're running `vite dev`, the server function infrastructure is handled automatically

### CSV or Excel upload fails with "No valid rows found"

The file must have these exact column headers (case-insensitive):

```
Date, Description, Category, Amount, Type
```

Download the template from the Transactions page for a correctly formatted example.

### Firestore permission errors in the console

- In the Firebase Console → Firestore → Rules, make sure your security rules allow reads/writes for authenticated users:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```

### Dev server is slow to start

The first cold start can take 20–30 seconds as Vite pre-bundles ~70 dependencies. Subsequent starts are much faster due to caching.

### TypeScript errors in the IDE

Run `npm install` to make sure all type packages are installed. This project uses **strict** TypeScript mode — all type errors are intentional guards.

---

## License

This project is private. All rights reserved.
