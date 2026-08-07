import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/landing/Reveal";
import { useProgress } from "@/hooks/useProgress";
import { useTransactions } from "@/hooks/useTransactions";
import { LESSON_MAP, LESSONS } from "@/data/lessons";
import { analyzeTransactions } from "@/engine/analysisEngine";
import { TOPIC_LABELS } from "@/types";
import type { LessonTopic } from "@/types";
import { getPersonalization } from "@/lib/groq";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/lessons_/$lessonId")({
  head: () => ({ meta: [{ title: "Lesson — FinMentor AI" }] }),
  component: LessonPage,
});

// ── Simple markdown renderer ────────────────────────────────────────────────

function renderMarkdown(content: string): React.ReactNode[] {
  return content.split("\n\n").map((block, i) => {
    // Heading
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-xl font-bold text-foreground mt-6 mb-2">
          {block.slice(3)}
        </h2>
      );
    }

    // Table (basic)
    if (block.includes("| --- |") || block.includes("|---|")) {
      const rows = block.split("\n").filter((r) => !r.match(/^\|[-\s|]+\|$/));
      return (
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            {rows.map((row, ri) => {
              const cells = row
                .split("|")
                .filter((_, ci) => ci > 0 && ci < row.split("|").length - 1);
              const Tag = ri === 0 ? "th" : "td";
              return (
                <tr
                  key={ri}
                  className={ri === 0 ? "bg-muted" : "border-b border-border"}
                >
                  {cells.map((cell, ci) => (
                    <Tag
                      key={ci}
                      className="px-3 py-2 text-left text-foreground font-normal"
                    >
                      {cell.trim()}
                    </Tag>
                  ))}
                </tr>
              );
            })}
          </table>
        </div>
      );
    }

    // List
    if (block.startsWith("- ") || block.startsWith("* ")) {
      const items = block
        .split("\n")
        .filter((l) => l.startsWith("- ") || l.startsWith("* "));
      return (
        <ul key={i} className="my-3 space-y-1.5 pl-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item.slice(2)) }} />
            </li>
          ))}
        </ul>
      );
    }

    // Numbered list
    if (/^\d+\. /.test(block)) {
      const items = block.split("\n").filter((l) => /^\d+\. /.test(l));
      return (
        <ol key={i} className="my-3 space-y-1.5 pl-5 list-decimal text-foreground/90">
          {items.map((item, ii) => (
            <li key={ii} dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^\d+\. /, "")) }} />
          ))}
        </ol>
      );
    }

    // Paragraph
    return (
      <p
        key={i}
        className="text-foreground/90 leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: formatInline(block) }}
      />
    );
  });
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>');
}

// ── Main Component ─────────────────────────────────────────────────────────────

function LessonPage() {
  const { lessonId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { progress, updateProgress } = useProgress();
  const { transactions } = useTransactions();

  const lesson = LESSON_MAP.get(lessonId);
  const [personalization, setPersonalization] = useState<{
    insight: string;
    action: string;
  } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Mark as in_progress when lesson opens
  useEffect(() => {
    if (!progress || !lesson) return;
    const lp = progress.lessonProgress.find((l) => l.lessonId === lessonId);
    if (lp && lp.status === "unlocked") {
      updateProgress({
        lessonProgress: progress.lessonProgress.map((l) =>
          l.lessonId === lessonId ? { ...l, status: "in_progress" } : l,
        ),
        currentLessonId: lessonId,
      });
    }
  }, [lessonId, lesson]);

  // Fetch AI personalization
  useEffect(() => {
    if (!lesson) return;

    const profile =
      user && transactions.length > 0
        ? analyzeTransactions(user.uid, transactions)
        : null;

    setLoadingAI(true);
    getPersonalization({
      data: {
        lessonTitle: lesson.title,
        lessonContent: lesson.content,
        keyTakeaways: lesson.keyTakeaways,
        financialProfile: profile
          ? {
              savingsRate: profile.savingsRate,
              highestExpenseCategory: profile.highestExpenseCategory,
              monthlyIncome: profile.monthlyIncome,
              monthlyExpenses: profile.monthlyExpenses,
              observations: profile.observations,
            }
          : null,
      },
    })
      .then(setPersonalization)
      .catch(() =>
        setPersonalization({
          insight: "This lesson applies directly to building better financial habits. Read carefully and reflect on how each principle applies to your situation.",
          action: "Pick one key takeaway and implement it before your next session.",
        }),
      )
      .finally(() => setLoadingAI(false));
  }, [lessonId, lesson]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/app/lessons">Back to Lessons</Link>
        </Button>
      </div>
    );
  }

  // Next lesson in roadmap
  const roadmap = progress?.roadmap ?? LESSONS.map((l) => l.id);
  const currentIdx = roadmap.indexOf(lessonId);
  const nextLessonId = currentIdx >= 0 ? roadmap[currentIdx + 1] : undefined;

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Back */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="rounded-full -ml-2">
          <Link to="/app/lessons">
            <ArrowLeft className="h-4 w-4" />
            My Lessons
          </Link>
        </Button>
      </div>

      {/* Header */}
      <Reveal>
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            {TOPIC_LABELS[lesson.topic as LessonTopic]}
          </span>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl leading-snug mb-3">
            {lesson.title}
          </h1>
          <p className="text-base text-muted-foreground mb-4">
            {lesson.objective}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              ~{lesson.estimatedMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              2 quiz questions
            </span>
          </div>
        </div>
      </Reveal>

      {/* Content */}
      <Reveal delayIndex={1}>
        <article className="card-surface p-6 sm:p-8 mb-6 prose-sm">
          {renderMarkdown(lesson.content)}
        </article>
      </Reveal>

      {/* Key Takeaways */}
      <Reveal delayIndex={2}>
        <div className="card-surface p-6 mb-6 border-primary/20 bg-primary-soft/20">
          <h2 className="flex items-center gap-2 font-semibold text-foreground mb-4">
            <Zap className="h-4.5 w-4.5 text-primary" />
            Key Takeaways
          </h2>
          <ul className="space-y-2.5">
            {lesson.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <span className="text-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* AI Personalization */}
      <Reveal delayIndex={3}>
        <div className="card-surface p-6 mb-8 border-brand-purple/20 bg-gradient-to-br from-brand-purple-soft/40 to-brand-blue-soft/40">
          <h2 className="flex items-center gap-2 font-semibold text-foreground mb-4">
            <Sparkles className="h-4.5 w-4.5 text-brand-purple" />
            Your Personalized Insight
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              — powered by AI
            </span>
          </h2>

          {loadingAI ? (
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
              <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
            </div>
          ) : personalization ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-brand-purple uppercase tracking-wide mb-1.5">
                  💡 How this applies to you
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {personalization.insight}
                </p>
              </div>
              <div className="rounded-xl bg-brand-blue-soft/60 border border-brand-blue/20 px-4 py-3">
                <p className="text-xs font-semibold text-brand-blue uppercase tracking-wide mb-1.5">
                  🎯 Your action this week
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {personalization.action}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal delayIndex={4}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            size="lg"
            className="flex-1 h-12 rounded-full bg-gradient-brand hover:opacity-90 shadow-lift text-base"
          >
            <Link to="/app/quiz/$lessonId" params={{ lessonId: lesson.id }}>
              Take the Quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {nextLessonId && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 h-12 rounded-full border-border"
            >
              <Link
                to="/app/lessons/$lessonId"
                params={{ lessonId: nextLessonId }}
              >
                Skip to Next Lesson
              </Link>
            </Button>
          )}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          You must pass the quiz to unlock the next lesson
        </p>
      </Reveal>
    </div>
  );
}
