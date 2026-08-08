/**
 * Learning Recommendation Engine — rule-based, zero AI, fully deterministic.
 *
 * Input:  FinancialProfile (output of analysisEngine.ts)
 * Output: string[] — ordered lesson IDs (highest priority first)
 *
 * ── Design Philosophy ──────────────────────────────────────────────────────
 *
 * Every lesson topic receives a priority score computed purely from the
 * user's real financial signals ("additive penalty" model):
 *
 *   • Topics addressing the user's WORST areas get the HIGHEST score.
 *   • Topics for areas where the user is already strong get LOW scores.
 *   • Advanced topics (investing, financial independence) are gated behind
 *     baseline readiness — they only surface when fundamentals are covered.
 *
 * This produces meaningfully different roadmaps:
 *   User A (low savings, high spending)   → Budgeting → Saving → Emergency Fund …
 *   User B (great savings, no investment) → Investing → Goal Planning → Insurance …
 *   User C (high EMI / debt)              → Debt → Budgeting → Saving …
 *
 * Score range: 0–200 per topic (higher = teach sooner).
 */

import type { FinancialProfile, LessonTopic } from "@/types";
import { LESSONS } from "@/data/lessons";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TopicScore {
  topic: LessonTopic;
  priority: number;
  /** Human-readable reasons why this topic was prioritized */
  reasons: string[];
}

export interface RoadmapResult {
  /** Ordered lesson IDs — highest priority first */
  lessonIds: string[];
  /** Detailed scores for explainability / AI mentor context */
  topicScores: TopicScore[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function discretionaryPct(profile: FinancialProfile): number {
  const cats = ["food_dining", "shopping", "entertainment", "subscriptions"];
  return profile.categoryBreakdown
    .filter((c) => cats.includes(c.category))
    .reduce((s, c) => s + c.percentage, 0);
}

// ── Core Scoring Logic ────────────────────────────────────────────────────────

export function scoreLessonTopics(profile: FinancialProfile): TopicScore[] {
  const debtRatio = clamp(
    profile.monthlyIncome > 0 ? profile.debtEmiSpend / profile.monthlyIncome : 0,
    0, 1,
  );
  const subRatio = clamp(
    profile.monthlyExpenses > 0 ? profile.subscriptionSpend / profile.monthlyExpenses : 0,
    0, 1,
  );
  const discPct = discretionaryPct(profile);
  const savings = clamp(profile.savingsRate, 0, 100);
  const emergency = clamp(profile.emergencyFundMonths, 0, 12);
  const investment = clamp(profile.investmentRate, 0, 100);

  // Readiness tiers used to gate advanced topics
  const hasBasicStability = savings >= 10 && emergency >= 1;
  const hasGoodStability  = savings >= 20 && emergency >= 3;
  const isFinanciallyMature = savings >= 25 && emergency >= 6 && investment >= 10 && debtRatio < 0.15;

  // ── 1. Budgeting ─────────────────────────────────────────────────────────
  const budgetingReasons: string[] = [];
  let budgetingScore = 5;

  if (savings < 5)       { budgetingScore += 80; budgetingReasons.push("Very low savings rate — budgeting is urgently needed"); }
  else if (savings < 15) { budgetingScore += 50; budgetingReasons.push("Below-average savings rate"); }
  else if (savings < 20) { budgetingScore += 20; budgetingReasons.push("Savings rate slightly below 20% target"); }

  if (["food_dining","shopping","entertainment"].includes(profile.highestExpenseCategory)) {
    budgetingScore += 30; budgetingReasons.push("Discretionary spending is the biggest expense category");
  }
  if (discPct > 50)      { budgetingScore += 25; budgetingReasons.push("Discretionary spending exceeds 50% of expenses"); }
  else if (discPct > 35) { budgetingScore += 12; budgetingReasons.push("High proportion of discretionary spending"); }

  if (profile.cashFlow < 0) { budgetingScore += 40; budgetingReasons.push("Negative cash flow — spending exceeds income"); }
  if (savings >= 30 && discPct <= 30) {
    budgetingScore = Math.max(budgetingScore - 30, 5);
    budgetingReasons.push("Strong savings rate reduces urgency");
  }

  // ── 2. Smart Saving ───────────────────────────────────────────────────────
  const savingReasons: string[] = [];
  let savingScore = 5;

  if (savings < 5)       { savingScore += 65; savingReasons.push("Critically low savings — smart saving is essential"); }
  else if (savings < 10) { savingScore += 45; savingReasons.push("Low savings rate — key growth area"); }
  else if (savings < 20) { savingScore += 25; savingReasons.push("Below recommended 20% savings target"); }
  else if (savings < 30) { savingScore += 10; savingReasons.push("Good savings, room for further optimization"); }

  if (savings >= 30) {
    savingScore = Math.max(savingScore - 20, 5);
    savingReasons.push("Strong savings rate already established");
  }

  // ── 3. Emergency Fund ─────────────────────────────────────────────────────
  const emergencyReasons: string[] = [];
  let emergencyScore = 5;

  if (emergency === 0)     { emergencyScore += 70; emergencyReasons.push("No emergency fund detected — critical gap"); }
  else if (emergency < 1)  { emergencyScore += 55; emergencyReasons.push("Emergency fund covers less than 1 month"); }
  else if (emergency < 3)  { emergencyScore += 40; emergencyReasons.push("Emergency fund below 3-month minimum"); }
  else if (emergency < 6)  { emergencyScore += 15; emergencyReasons.push("Emergency fund adequate but not fully optimized"); }
  else                     { emergencyScore += 3;  emergencyReasons.push("Emergency fund is healthy (6+ months)"); }

  if (emergency >= 6) emergencyScore = Math.max(emergencyScore - 20, 3);

  // ── 4. Debt Management ────────────────────────────────────────────────────
  // Zero base — only appears prominently when real debt exists.
  const debtReasons: string[] = [];
  let debtScore = 0;

  if (debtRatio > 0.5)      { debtScore += 120; debtReasons.push("Debt/EMI exceeds 50% of income — extremely high burden"); }
  else if (debtRatio > 0.4) { debtScore += 95;  debtReasons.push("Debt/EMI exceeds 40% of income — high burden"); }
  else if (debtRatio > 0.3) { debtScore += 65;  debtReasons.push("Debt/EMI is 30–40% of income — moderate-high burden"); }
  else if (debtRatio > 0.2) { debtScore += 40;  debtReasons.push("Debt/EMI is 20–30% of income — worth monitoring"); }
  else if (debtRatio > 0.1) { debtScore += 15;  debtReasons.push("Some debt/EMI present"); }
  else                      { debtScore += 3;   debtReasons.push("Low or no debt detected"); }

  if (debtRatio > 0.2 && profile.cashFlow < 0) {
    debtScore += 30; debtReasons.push("Debt combined with negative cash flow is critical");
  }

  // ── 5. Investing Basics ───────────────────────────────────────────────────
  // Gated: only high priority when the user has stability but no investments.
  const investingReasons: string[] = [];
  let investingScore = 0;

  if (hasGoodStability && investment < 5) {
    investingScore += 85; investingReasons.push("Good savings & emergency fund — ready to start investing");
  } else if (hasBasicStability && investment < 5) {
    investingScore += 45; investingReasons.push("Basic stability in place — investing is the next step");
  } else if (hasGoodStability && investment < 10) {
    investingScore += 35; investingReasons.push("Could increase investment rate above 10%");
  } else if (!hasBasicStability) {
    investingScore += 5; investingReasons.push("Build savings & emergency fund before investing");
  } else {
    investingScore += investment >= 10 ? 20 : 10;
    investingReasons.push(investment >= 10 ? "Decent investment rate — reinforce with structure" : "Some investments — room to grow");
  }

  if (investment < 5 && savings >= 15) {
    investingScore += 20; investingReasons.push("Savings exist but investments are near zero — idle money");
  }

  // ── 6. Financial Goal Planning ────────────────────────────────────────────
  // Useful only after basic financial stability is achieved.
  const goalReasons: string[] = [];
  let goalScore = 0;

  if (hasGoodStability && investment >= 5) {
    goalScore += 55; goalReasons.push("Stable finances with investments — time to set concrete goals");
  } else if (hasGoodStability) {
    goalScore += 30; goalReasons.push("Good financial position — goal planning maximizes impact");
  } else if (hasBasicStability) {
    goalScore += 15; goalReasons.push("Building stability — goal planning provides direction");
  } else {
    goalScore += 5;  goalReasons.push("Focus on fundamentals before goal planning");
  }

  // ── 7. Insurance Essentials ───────────────────────────────────────────────
  // Universally relevant, but deprioritized when more urgent needs exist.
  const insuranceReasons: string[] = [];
  let insuranceScore = 10;

  if (hasGoodStability)      { insuranceScore += 30; insuranceReasons.push("Financially stable — insurance protects accumulated wealth"); }
  else if (hasBasicStability) { insuranceScore += 15; insuranceReasons.push("Basic stability achieved — insurance is the next safety layer"); }
  else                        { insuranceScore += 3;  insuranceReasons.push("Address savings/debt before focusing on insurance"); }

  if (debtRatio > 0.2) { insuranceScore += 10; insuranceReasons.push("Debt burden increases importance of insurance protection"); }

  // ── 8. Digital Payments & Financial Safety ────────────────────────────────
  const digitalReasons: string[] = [];
  let digitalScore = 8;

  if (subRatio > 0.15)      { digitalScore += 20; digitalReasons.push("High subscription spend — digital literacy is important"); }
  else if (subRatio > 0.08) { digitalScore += 10; digitalReasons.push("Moderate subscription spend — digital safety applies"); }
  else                      { digitalScore += 3;  digitalReasons.push("General digital financial literacy benefit"); }

  // ── 9. Lifestyle & Spending Psychology ────────────────────────────────────
  const psychologyReasons: string[] = [];
  let psychologyScore = 3;

  if (discPct > 55)      { psychologyScore += 50; psychologyReasons.push("Very high discretionary spending — psychology is the root cause"); }
  else if (discPct > 40) { psychologyScore += 30; psychologyReasons.push("High discretionary spending signals habits to examine"); }
  else if (discPct > 30) { psychologyScore += 15; psychologyReasons.push("Moderate discretionary spending — lifestyle reflection helpful"); }

  if (savings >= 20 && investment < 5) {
    psychologyScore += 20; psychologyReasons.push("Good saver but not investing — mindset barriers likely");
  }

  // ── 10. Becoming Financially Independent ─────────────────────────────────
  // Advanced: only surfaces when all fundamentals are strong.
  const independenceReasons: string[] = [];
  let independenceScore = 0;

  if (isFinanciallyMature) {
    independenceScore += 70; independenceReasons.push("Strong across all fundamentals — ready for FI planning");
  } else if (savings >= 20 && emergency >= 3 && investment >= 5) {
    independenceScore += 30; independenceReasons.push("Good foundation — financial independence is a motivating horizon");
  } else if (investment >= 10) {
    independenceScore += 15; independenceReasons.push("Active investor — independence planning is relevant");
  } else {
    independenceScore += 3; independenceReasons.push("Focus on fundamentals first — revisit after building stability");
  }

  // ── Assemble & sort ───────────────────────────────────────────────────────

  const PEDAGOGICAL_ORDER: LessonTopic[] = [
    "budgeting","saving","emergency_fund","debt","investing",
    "goal_planning","insurance","digital_safety","spending_psychology","financial_independence",
  ];

  const raw: TopicScore[] = [
    { topic: "budgeting",              priority: clamp(budgetingScore,    0, 200), reasons: budgetingReasons },
    { topic: "saving",                 priority: clamp(savingScore,       0, 200), reasons: savingReasons },
    { topic: "emergency_fund",         priority: clamp(emergencyScore,    0, 200), reasons: emergencyReasons },
    { topic: "debt",                   priority: clamp(debtScore,         0, 200), reasons: debtReasons },
    { topic: "investing",              priority: clamp(investingScore,    0, 200), reasons: investingReasons },
    { topic: "goal_planning",          priority: clamp(goalScore,         0, 200), reasons: goalReasons },
    { topic: "insurance",              priority: clamp(insuranceScore,    0, 200), reasons: insuranceReasons },
    { topic: "digital_safety",         priority: clamp(digitalScore,      0, 200), reasons: digitalReasons },
    { topic: "spending_psychology",    priority: clamp(psychologyScore,   0, 200), reasons: psychologyReasons },
    { topic: "financial_independence", priority: clamp(independenceScore, 0, 200), reasons: independenceReasons },
  ];

  raw.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return PEDAGOGICAL_ORDER.indexOf(a.topic) - PEDAGOGICAL_ORDER.indexOf(b.topic);
  });

  return raw;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Build a personalized learning roadmap from a financial profile.
 * Returns both ordered lesson IDs and full scoring detail for explainability.
 */
export function buildRoadmapWithScores(profile: FinancialProfile): RoadmapResult {
  const topicScores = scoreLessonTopics(profile);

  const topicToLessonId = new Map<LessonTopic, string>();
  for (const lesson of LESSONS) {
    topicToLessonId.set(lesson.topic, lesson.id);
  }

  const lessonIds = topicScores
    .map((ts) => topicToLessonId.get(ts.topic))
    .filter(Boolean) as string[];

  return { lessonIds, topicScores };
}

/**
 * Returns just the ordered lesson ID array.
 * Use buildRoadmapWithScores() when you need scoring detail.
 */
export function buildRoadmap(profile: FinancialProfile): string[] {
  return buildRoadmapWithScores(profile).lessonIds;
}

// ── Literacy Score ────────────────────────────────────────────────────────────

/**
 * Compute Financial Literacy Score (0–100) from progress data.
 *
 * Formula:
 *   base     = lessons_completed / total_lessons * 60
 *   accuracy = quiz_accuracy * 20
 *   streak   = min(streak_days, 30) / 30 * 10
 *   bonus    = achievements_count * 1  (capped at 10)
 */
export function computeLiteracyScore({
  lessonsCompleted,
  totalLessons,
  quizAccuracy,
  streakDays,
  achievementCount,
}: {
  lessonsCompleted: number;
  totalLessons: number;
  quizAccuracy: number;
  streakDays: number;
  achievementCount: number;
}): number {
  const safeStreak = streakDays || 0;
  const safeAccuracy = quizAccuracy || 0;
  const safeAchievements = achievementCount || 0;

  const base = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 60 : 0;
  const accuracy = (safeAccuracy / 100) * 20;
  const streak = (Math.min(safeStreak, 30) / 30) * 10;
  const bonus = Math.min(safeAchievements * 1, 10);
  return Math.round(Math.min(base + accuracy + streak + bonus, 100));
}
