/**
 * Learning Recommendation Engine — rule-based, zero AI.
 *
 * Takes a FinancialProfile and returns an ordered array of lesson IDs
 * representing the user's personalized learning roadmap.
 *
 * Priority logic:
 *   1. Identify the user's weakest financial areas from observations & scores.
 *   2. Map weak areas to lesson topics.
 *   3. Order topics by urgency (most critical weakness first).
 *   4. Fill remaining slots with lessons from the default curriculum order.
 */

import type { FinancialProfile, LessonTopic } from "@/types";
import { LESSONS } from "@/data/lessons";

// ── Priority weights per observation/condition ─────────────────────────────

interface TopicScore {
  topic: LessonTopic;
  priority: number; // higher = teach sooner
}

export function buildRoadmap(profile: FinancialProfile): string[] {
  const scores: Map<LessonTopic, number> = new Map();

  // Helper to add priority weight
  const add = (topic: LessonTopic, weight: number) => {
    scores.set(topic, (scores.get(topic) ?? 0) + weight);
  };

  // ── Savings rate ──────────────────────────────────────────────────────────

  if (profile.savingsRate < 10) {
    add("budgeting", 40);
    add("saving", 35);
    add("spending_psychology", 20);
  } else if (profile.savingsRate < 20) {
    add("saving", 20);
    add("budgeting", 15);
  }

  // ── Emergency fund ────────────────────────────────────────────────────────

  if (profile.emergencyFundMonths < 3) {
    add("emergency_fund", 35);
  }

  // ── Debt / EMI ────────────────────────────────────────────────────────────

  const debtRatio =
    profile.monthlyIncome > 0
      ? profile.debtEmiSpend / profile.monthlyIncome
      : 0;

  if (debtRatio > 0.4) {
    add("debt", 45);
  } else if (debtRatio > 0.2) {
    add("debt", 20);
  }

  // ── Investment rate ───────────────────────────────────────────────────────

  if (profile.investmentRate < 5) {
    add("investing", 30);
    add("goal_planning", 15);
  } else if (profile.investmentRate >= 10) {
    add("financial_independence", 20);
  }

  // ── High subscription load ────────────────────────────────────────────────

  const subRatio =
    profile.monthlyExpenses > 0
      ? profile.subscriptionSpend / profile.monthlyExpenses
      : 0;

  if (subRatio > 0.1) {
    add("spending_psychology", 15);
    add("budgeting", 10);
  }

  // ── Insurance (universal baseline) ────────────────────────────────────────

  add("insurance", 10);
  add("digital_safety", 8);

  // ── Build ordered list ────────────────────────────────────────────────────

  // All topics with their final scores
  const allTopics: LessonTopic[] = [
    "budgeting",
    "saving",
    "emergency_fund",
    "debt",
    "investing",
    "goal_planning",
    "insurance",
    "digital_safety",
    "spending_psychology",
    "financial_independence",
  ];

  const topicScores: TopicScore[] = allTopics.map((topic) => ({
    topic,
    priority: scores.get(topic) ?? 0,
  }));

  // Sort: higher priority first; ties broken by default curriculum order
  topicScores.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    const ai = allTopics.indexOf(a.topic);
    const bi = allTopics.indexOf(b.topic);
    return ai - bi;
  });

  // Map topic → lesson ID (each topic has exactly one lesson in MVP)
  const topicToLessonId = new Map<LessonTopic, string>();
  for (const lesson of LESSONS) {
    topicToLessonId.set(lesson.topic, lesson.id);
  }

  return topicScores
    .map((ts) => topicToLessonId.get(ts.topic))
    .filter(Boolean) as string[];
}

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
  quizAccuracy, // 0–100
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
