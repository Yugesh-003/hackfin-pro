import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  Flame,
  GraduationCap,
  Heart,
  Lock,
  Receipt,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/landing/Reveal";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { useTransactions } from "@/hooks/useTransactions";
import { analyzeTransactions } from "@/engine/analysisEngine";
import { LESSON_MAP } from "@/data/lessons";
import { TOPIC_LABELS } from "@/types";
import type { LessonTopic } from "@/types";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — FinMentor AI" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { progress, achievements, loading: progressLoading } = useProgress();
  const { transactions, loading: txLoading } = useTransactions();

  const loading = progressLoading || txLoading;

  // Run rule-based analysis if transactions exist
  const profile =
    transactions.length > 0 && user
      ? analyzeTransactions(user.uid, transactions)
      : null;

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  const completedLessons =
    progress?.lessonProgress.filter((lp) => lp.status === "completed")
      .length ?? 0;
  const totalLessons = 10;

  const currentLesson = progress?.roadmap
    .map((id) => {
      const lp = progress.lessonProgress.find((l) => l.lessonId === id);
      const lesson = LESSON_MAP.get(id);
      return { lp, lesson };
    })
    .find(({ lp }) => lp?.status === "unlocked" || lp?.status === "in_progress");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground animate-pulse">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        description="Here's your financial learning progress at a glance."
      />

      {/* No transactions CTA */}
      {transactions.length === 0 && (
        <Reveal>
          <div className="card-surface p-6 border-dashed border-2 border-primary/30 bg-primary-soft/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Upload className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Add your transactions to personalize your journey
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload a bank statement (CSV or Excel) or add transactions manually. Your financial profile powers the entire platform.
                </p>
              </div>
              <Button
                asChild
                className="shrink-0 rounded-full bg-gradient-brand hover:opacity-90 shadow-soft"
              >
                <Link to="/app/transactions">
                  <Receipt className="h-4 w-4" />
                  Add Transactions
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Key Metrics */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Your Scores
        </h2>
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
              value={
                profile
                  ? `${profile.financialHealthScore}/100`
                  : "—"
              }
              subtext={
                profile
                  ? profile.financialHealthScore >= 70
                    ? "Great shape"
                    : profile.financialHealthScore >= 40
                      ? "Room to improve"
                      : "Needs attention"
                  : "Add transactions"
              }
              icon={<Heart className="h-5 w-5" />}
              accent="blue"
            />
          </Reveal>

          <Reveal delayIndex={2}>
            <StatCard
              label="Learning Streak"
              value={`${progress?.currentStreak ?? 0} days`}
              subtext={
                (progress?.currentStreak ?? 0) > 0
                  ? "Keep it up!"
                  : "Start learning today"
              }
              icon={<Flame className="h-5 w-5" />}
              accent="purple"
            />
          </Reveal>

          <Reveal delayIndex={3}>
            <StatCard
              label="Quiz Accuracy"
              value={`${Math.round(progress?.quizAccuracy ?? 0)}%`}
              subtext={`${completedLessons} of ${totalLessons} lessons done`}
              icon={<Target className="h-5 w-5" />}
              accent="primary"
            />
          </Reveal>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Lesson */}
        <Reveal className="lg:col-span-2">
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-semibold text-foreground">
                Continue Learning
              </h2>
            </div>

            {currentLesson?.lesson ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-primary-soft/50 border border-primary/20 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                        {TOPIC_LABELS[currentLesson.lesson.topic as LessonTopic]}
                      </p>
                      <h3 className="text-base font-semibold text-foreground leading-snug">
                        {currentLesson.lesson.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {currentLesson.lesson.objective}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      ~{currentLesson.lesson.estimatedMinutes} min read
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-gradient-brand hover:opacity-90"
                    >
                      <Link to="/app/lessons/$lessonId" params={{ lessonId: currentLesson.lesson.id }}>
                        Start Lesson
                        <Zap className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Roadmap preview */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2.5">
                    Your roadmap
                  </p>
                  <ul className="space-y-2">
                    {(progress?.roadmap.slice(0, 5) ?? []).map((id) => {
                      const lesson = LESSON_MAP.get(id);
                      const lp = progress?.lessonProgress.find(
                        (l) => l.lessonId === id,
                      );
                      if (!lesson) return null;

                      return (
                        <li
                          key={id}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          {lp?.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          ) : lp?.status === "locked" ? (
                            <Lock className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                          ) : (
                            <div className="h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-primary-soft" />
                          )}
                          <span
                            className={
                              lp?.status === "completed"
                                ? "text-foreground line-through decoration-muted-foreground/40"
                                : lp?.status === "locked"
                                  ? "text-muted-foreground/50"
                                  : "text-foreground font-medium"
                            }
                          >
                            {lesson.title.split(":")[0]}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {(progress?.roadmap.length ?? 0) > 5 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      +{(progress?.roadmap.length ?? 0) - 5} more lessons
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="h-8 w-8" />}
                title="No lessons unlocked yet"
                description="Add your transactions so we can build your personalized learning roadmap."
                action={
                  <Button
                    asChild
                    className="rounded-full bg-gradient-brand hover:opacity-90"
                  >
                    <Link to="/app/transactions">Add Transactions</Link>
                  </Button>
                }
              />
            )}
          </div>
        </Reveal>

        {/* Right column */}
        <div className="space-y-5">
          {/* Skill Progress */}
          <Reveal>
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4.5 w-4.5 text-brand-blue" />
                <h2 className="font-semibold text-foreground">Skill Progress</h2>
              </div>
              <ul className="space-y-3">
                {(progress?.skillProgress ?? []).slice(0, 5).map((sp) => (
                  <li key={sp.topic}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">
                        {TOPIC_LABELS[sp.topic as LessonTopic]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {sp.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={sp.percentage}
                      className="h-1.5"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Achievements */}
          <Reveal delayIndex={1}>
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4.5 w-4.5 text-brand-purple" />
                <h2 className="font-semibold text-foreground">Achievements</h2>
              </div>

              {achievements.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {achievements.slice(0, 6).map((a) => (
                    <div
                      key={a.id}
                      title={a.title}
                      className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-2.5 text-center"
                    >
                      <span className="text-2xl">{a.emoji}</span>
                      <span className="text-xs font-medium text-foreground leading-tight">
                        {a.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Complete lessons to unlock achievements! 🏆
                </p>
              )}
            </div>
          </Reveal>

          {/* AI Mentor CTA */}
          <Reveal delayIndex={2}>
            <div className="card-surface p-5 bg-gradient-to-br from-brand-purple-soft to-brand-blue-soft border-brand-purple/20">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-purple-soft text-brand-purple">
                  <Bot className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Ask your AI mentor
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    "Why do I keep overspending?" · "What should I learn next?"
                  </p>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                  >
                    <Link to="/app/mentor">
                      Chat Now
                      <Bot className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Financial Profile (if analysis available) */}
      {profile && (
        <Reveal>
          <div className="card-surface p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-semibold text-foreground">
                Financial Profile
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Based on {transactions.length} transactions
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-5">
              <div className="rounded-2xl bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Monthly Income</p>
                <p className="text-lg font-bold text-foreground">
                  ₹{profile.monthlyIncome.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Monthly Expenses</p>
                <p className="text-lg font-bold text-foreground">
                  ₹{profile.monthlyExpenses.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Savings Rate</p>
                <p className="text-lg font-bold text-primary">
                  {profile.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3.5">
                <p className="text-xs text-muted-foreground mb-1">Cash Flow</p>
                <p
                  className={`text-lg font-bold ${profile.cashFlow >= 0 ? "text-primary" : "text-destructive"}`}
                >
                  {profile.cashFlow >= 0 ? "+" : ""}₹
                  {Math.abs(profile.cashFlow).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Observations */}
            {profile.observations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Key Observations
                </p>
                {profile.observations.map((obs, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-sm ${
                      obs.type === "warning"
                        ? "bg-destructive/8 text-foreground"
                        : obs.type === "positive"
                          ? "bg-primary-soft text-foreground"
                          : "bg-muted text-foreground"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 text-base">
                      {obs.type === "warning"
                        ? "⚠️"
                        : obs.type === "positive"
                          ? "✅"
                          : "ℹ️"}
                    </span>
                    {obs.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
