/**
 * Groq API server function.
 * Called server-side only — GROQ_API_KEY never reaches the browser.
 */
import { createServerFn } from "@tanstack/react-start";
import Groq from "groq-sdk";

// ── Lesson Personalization ─────────────────────────────────────────────────────

interface PersonalizationInput {
  lessonTitle: string;
  lessonContent: string;
  keyTakeaways: string[];
  financialProfile: {
    savingsRate: number;
    highestExpenseCategory: string;
    monthlyIncome: number;
    monthlyExpenses: number;
    observations: { type: string; message: string }[];
  } | null;
}

interface PersonalizationOutput {
  insight: string;
  action: string;
}

export const getPersonalization = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as PersonalizationInput)
  .handler(async ({ data }): Promise<PersonalizationOutput> => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const profileSummary = data.financialProfile
      ? `The user's savings rate is ${data.financialProfile.savingsRate.toFixed(1)}%. ` +
        `Their highest expense category is "${data.financialProfile.highestExpenseCategory}". ` +
        `Monthly income: ₹${data.financialProfile.monthlyIncome.toLocaleString()}. ` +
        `Monthly expenses: ₹${data.financialProfile.monthlyExpenses.toLocaleString()}. ` +
        `Key observations: ${data.financialProfile.observations.map((o) => o.message).join(" | ")}`
      : "The user hasn't added transaction data yet.";

    const prompt = `You are a supportive financial literacy coach. A user has just read a lesson titled "${data.lessonTitle}".

Their financial profile: ${profileSummary}

Key takeaways from the lesson:
${data.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Based on ONLY their financial profile and this lesson content, provide:
1. A personalized "insight" (2–3 sentences): Connect one specific observation from their financial data to a concept in this lesson. Be specific, empathetic, and never shame them.
2. A personalized "action" (1–2 sentences): One concrete, achievable action they can take THIS WEEK based on this lesson and their specific situation.

Rules:
- Never invent financial data that wasn't in the profile
- Never be preachy or shame the user
- Keep it warm, practical, and encouraging
- Do NOT rewrite the lesson or add new concepts

Respond ONLY with valid JSON in this exact format:
{"insight": "...", "action": "..."}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(content);
      return {
        insight: parsed.insight ?? "Keep working through the lessons — each one builds on the last.",
        action: parsed.action ?? "Review today's key takeaways and identify one habit you can change this week.",
      };
    } catch {
      return {
        insight: "This lesson is directly relevant to your financial situation. Understanding these principles is your first step toward improvement.",
        action: "Pick one key takeaway from this lesson and implement it before your next session.",
      };
    }
  });

// ── AI Mentor Chat ─────────────────────────────────────────────────────────────

interface MentorInput {
  messages: { role: "user" | "assistant"; content: string }[];
  financialProfile: {
    savingsRate: number;
    highestExpenseCategory: string;
    monthlyIncome: number;
    monthlyExpenses: number;
    observations: { type: string; message: string }[];
  } | null;
  completedLessons: string[];
  currentLesson: string | null;
}

export const chatWithMentor = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as MentorInput)
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const profileContext = data.financialProfile
      ? `Savings rate: ${data.financialProfile.savingsRate.toFixed(1)}%. ` +
        `Top expense: ${data.financialProfile.highestExpenseCategory}. ` +
        `Income: ₹${data.financialProfile.monthlyIncome.toLocaleString()}/month. ` +
        `Expenses: ₹${data.financialProfile.monthlyExpenses.toLocaleString()}/month. ` +
        `Observations: ${data.financialProfile.observations.map((o) => o.message).join("; ")}`
      : "No transaction data available yet.";

    const systemPrompt = `You are FinMentor, a warm, knowledgeable, and encouraging AI financial literacy coach built into the FinMentor AI platform.

USER CONTEXT:
- Financial profile: ${profileContext}
- Completed lessons: ${data.completedLessons.length > 0 ? data.completedLessons.join(", ") : "None yet"}
- Current lesson: ${data.currentLesson ?? "Not started"}

YOUR ROLE:
- Answer questions about personal finance, the user's learning journey, and their financial habits
- Reference their actual financial data when relevant
- Encourage and motivate — never shame or lecture
- Keep answers concise (3–5 sentences max unless more detail is genuinely needed)
- If asked to do something outside financial education, politely redirect

IMPORTANT: You are an EDUCATIONAL tool. You do not give specific investment advice, recommend specific funds/stocks, or diagnose specific legal/tax situations. For those, recommend a certified financial advisor.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...data.messages.slice(-10), // last 10 messages for context
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    return {
      reply:
        response.choices[0]?.message?.content ??
        "I'm having trouble responding right now. Please try again in a moment.",
    };
  });
