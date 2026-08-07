import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Award,
  BookOpen,
  Flame,
  GraduationCap,
  Heart,
  Target,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/landing/Reveal";
import { useProgress } from "@/hooks/useProgress";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { analyzeTransactions } from "@/engine/analysisEngine";
import { LESSON_MAP, LESSONS } from "@/data/lessons";
import { TOPIC_LABELS } from "@/types";
import type { LessonTopic } from "@/types";

export const Route = createFileRoute("/app/progress")({
  head: () => ({ meta: [{ title: "Progress — FinMentor AI" }] }),
  component: ProgressPage,
});

const ACHIEVEMENT_META: Record<
  string,
  { emoji: string; title: string; description: string }
> = {
  first_lesson: {
    emoji: "📖",
    title: "First Lesson",
    description: "Completed your first lesson",
  },
  first_quiz_passed: {
    emoji: "✅",
    title: "Quiz Champion",
    description: "Passed your first quiz",
  },
  three_day_streak: {
    emoji: "🔥",
    title: "3-Day Streak",
    description: "Learned 3 days in a row",
  },
  five_day_streak: {
    emoji: "⚡",
    title: "5-Day Streak",
    description: "Learned 5 days in a row",
  },
  saving_explorer: {
    emoji: "💰",
    title: "Saving Explorer",
    description: "Completed the Smart Saving lesson",
  },
  budget_beginner: {
    emoji: "📊",
    title: "Budget Beginner",
    description: "Completed the Budgeting lesson",
  },
  financial_learner: {
    emoji: "🎓",
    title: "Financial Learner",
    description: "Completed 5 lessons",
  },
  debt_slayer: {
    emoji: "⚔️",
    title: "Debt Slayer",
    description: "Completed the Debt Management lesson",
  },
  investment_starter: {
    emoji: "📈",
    title: "Investment Starter",
    description: "Completed the Investing Basics lesson",
  },
  quiz_perfectionist: {
    emoji: "💯",
    title: "Perfectionist",
    description: "Scored 100% on a quiz",
  },
};

function ProgressPage() {
  const { user } = useAuth();
  const { progress, achievements, loading } = useProgress();
  const { transactions } = useTransactions();

  const profile =
    user && transactions.length > 0
      ? analyzeTransactions(user.uid, transactions)
      : null;

  const completedLessons =
    progress?.lessonProgress.filter((lp) => lp.status === "completed") ?? [];
  const totalLessons = LESSONS.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Your Progress"
        description="Track your financial literacy journey and the habits you're building."
      />

      {/* Scores */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delayIndex={0}>
            <StatCard
              label="Financial Literacy Score"
              value={progress?.literacyScore ?? 0}
              subtext="out of 1,000"
              icon={<GraduationCap className="h-5 w-5" />}
              accent="primary"
            />
          </Reveal>
          <Reveal delayIndex={1}>
            <StatCard
              label="Financial Health Score"
              value={profile ? `${profile.financialHealthScore}/100` : "—"}
              subtext={profile ? "Based on your transactions" : "Add transactions"}
              icon={<Heart className="h-5 w-5" />}
              accent="blue"
            />
          </Reveal>
          <Reveal delayIndex={2}>
            <StatCard
              label="Quiz Accuracy"
              value={`${Math.round(progress?.quizAccuracy ?? 0)}%`}
              subtext="across all quizzes"
              icon={<Target className="h-5 w-5" />}
              accent="purple"
            />
          </Reveal>
          <Reveal delayIndex={3}>
            <StatCard
              label="Learning Streak"
              value={`${progress?.currentStreak ?? 0} days`}
              subtext={`${completedLessons.length}/${totalLessons} lessons done`}
              icon={<Flame className="h-5 w-5" />}
              accent="primary"
            />
          </Reveal>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill Progress */}
        <Reveal>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-semibold text-foreground">Skill Progress</h2>
            </div>
            <ul className="space-y-4">
              {(progress?.skillProgress ?? []).map((sp) => (
                <li key={sp.topic}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {TOPIC_LABELS[sp.topic as LessonTopic]}
                      </span>
                      {sp.percentage === 100 && (
                        <span className="text-xs text-primary font-semibold">✓ Done</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {sp.percentage}%
                    </span>
                  </div>
                  <Progress value={sp.percentage} className="h-2" />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Lesson History */}
        <Reveal delayIndex={1}>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-4.5 w-4.5 text-brand-blue" />
              <h2 className="font-semibold text-foreground">Lesson History</h2>
            </div>

            {completedLessons.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-7 w-7" />}
                title="No completed lessons yet"
                description="Start a lesson from your roadmap to begin."
                action={
                  <Button asChild size="sm" className="rounded-full bg-gradient-brand hover:opacity-90">
                    <Link to="/app/lessons">Browse Lessons</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-2.5">
                {completedLessons.map((lp) => {
                  const lesson = LESSON_MAP.get(lp.lessonId);
                  if (!lesson) return null;
                  return (
                    <li
                      key={lp.lessonId}
                      className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {lesson.title.split(":")[0]}
                        </p>
                        {lp.completedAt && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(lp.completedAt).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short", year: "numeric" },
                            )}
                          </p>
                        )}
                      </div>
                      {lp.bestQuizScore !== undefined && (
                        <span
                          className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                            lp.bestQuizScore === 100
                              ? "bg-primary-soft text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {lp.bestQuizScore}%
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Reveal>
      </div>

      {/* Achievements */}
      <Reveal>
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award className="h-4.5 w-4.5 text-brand-purple" />
            <h2 className="font-semibold text-foreground">Achievements</h2>
            {achievements.length > 0 && (
              <span className="ml-auto text-sm font-bold text-brand-purple">
                {achievements.length} unlocked
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(ACHIEVEMENT_META).map(([type, meta]) => {
              const unlocked = achievements.find((a) => a.type === type);
              return (
                <div
                  key={type}
                  className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-all ${
                    unlocked
                      ? "border-brand-purple/30 bg-brand-purple-soft/40"
                      : "border-border bg-muted/30 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-2xl shrink-0">{meta.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {meta.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meta.description}
                    </p>
                    {unlocked?.unlockedAt && (
                      <p className="text-xs text-brand-purple mt-0.5">
                        {new Date(unlocked.unlockedAt).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short" },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
