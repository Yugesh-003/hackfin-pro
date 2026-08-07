import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/EmptyState";
import { Reveal } from "@/components/landing/Reveal";
import { useProgress } from "@/hooks/useProgress";
import { LESSONS, LESSON_MAP } from "@/data/lessons";
import { TOPIC_LABELS } from "@/types";
import type { LessonTopic, LessonStatus } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/lessons")({
  head: () => ({ meta: [{ title: "My Lessons — FinMentor AI" }] }),
  component: LessonsPage,
});

const STATUS_CONFIG: Record<
  LessonStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  completed: {
    label: "Completed",
    color: "text-primary bg-primary-soft",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Progress",
    color: "text-brand-blue bg-brand-blue-soft",
    icon: PlayCircle,
  },
  unlocked: {
    label: "Ready",
    color: "text-brand-purple bg-brand-purple-soft",
    icon: Zap,
  },
  locked: {
    label: "Locked",
    color: "text-muted-foreground bg-muted",
    icon: Lock,
  },
};

function LessonsPage() {
  const { progress, loading } = useProgress();

  const completedCount =
    progress?.lessonProgress.filter((lp) => lp.status === "completed")
      .length ?? 0;
  const totalCount = LESSONS.length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  // Build ordered list from roadmap
  const orderedLessons = (progress?.roadmap ?? LESSONS.map((l) => l.id))
    .map((id) => {
      const lesson = LESSON_MAP.get(id);
      const lp = progress?.lessonProgress.find((l) => l.lessonId === id);
      return lesson && lp ? { lesson, lp } : null;
    })
    .filter(Boolean) as { lesson: (typeof LESSONS)[0]; lp: { lessonId: string; status: LessonStatus; bestQuizScore?: number; attempts: number } }[];

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
        title="My Lessons"
        description="Your personalized learning roadmap — topics ordered based on your financial profile."
      />

      {/* Overall Progress */}
      <Reveal>
        <div className="card-surface p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              <span className="font-semibold text-foreground">
                Overall Progress
              </span>
            </div>
            <span className="text-sm font-bold text-primary">
              {completedCount}/{totalCount} lessons
            </span>
          </div>
          <Progress value={overallPercent} className="h-2.5 mb-2" />
          <p className="text-xs text-muted-foreground">
            {overallPercent === 0
              ? "Start your first lesson to begin your financial education journey."
              : overallPercent === 100
                ? "🎉 You've completed all lessons! Revisit any time."
                : `${100 - overallPercent}% to go — you're making great progress!`}
          </p>
        </div>
      </Reveal>

      {/* Lesson Cards */}
      {orderedLessons.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="Your roadmap is being built"
          description="Add transactions so we can order lessons based on your financial profile."
          action={
            <Button asChild className="rounded-full bg-gradient-brand hover:opacity-90">
              <Link to="/app/transactions">Add Transactions</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {orderedLessons.map(({ lesson, lp }, index) => {
            const status = lp.status;
            const config = STATUS_CONFIG[status];
            const StatusIcon = config.icon;
            const isLocked = status === "locked";

            return (
              <Reveal key={lesson.id} delayIndex={index % 5}>
                <div
                  className={cn(
                    "card-surface p-5 transition-all duration-300",
                    !isLocked && "hover:-translate-y-0.5 hover:shadow-lift",
                    isLocked && "opacity-60",
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Step number */}
                    <div
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                        status === "completed"
                          ? "bg-primary-soft text-primary"
                          : status === "locked"
                            ? "bg-muted text-muted-foreground"
                            : "bg-gradient-brand text-primary-foreground",
                      )}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            config.color,
                          )}
                        >
                          <StatusIcon className="h-3 w-3 inline mr-1" />
                          {config.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {TOPIC_LABELS[lesson.topic as LessonTopic]}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-foreground leading-snug mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.objective}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          ~{lesson.estimatedMinutes} min
                        </span>
                        {lp.bestQuizScore !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            Quiz: {lp.bestQuizScore}%
                          </span>
                        )}
                        {lp.attempts > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {lp.attempts} attempt{lp.attempts > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    {!isLocked && (
                      <Button
                        asChild
                        size="sm"
                        className={cn(
                          "rounded-full shrink-0",
                          status === "completed"
                            ? "variant-outline border-border"
                            : "bg-gradient-brand hover:opacity-90",
                        )}
                        variant={status === "completed" ? "outline" : "default"}
                      >
                        <Link
                          to="/app/lessons/$lessonId"
                          params={{ lessonId: lesson.id }}
                        >
                          {status === "completed" ? "Review" : "Start"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
