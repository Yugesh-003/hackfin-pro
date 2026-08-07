import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { saveQuizResult } from "@/lib/firestore";
import { LESSON_MAP, LESSONS } from "@/data/lessons";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/quiz/$lessonId")({
  head: () => ({ meta: [{ title: "Quiz — FinMentor AI" }] }),
  component: QuizPage,
});

type QuizPhase = "answering" | "reviewing" | "passed" | "failed";

function QuizPage() {
  const { lessonId } = Route.useParams();
  const { user } = useAuth();
  const { progress, markLessonComplete } = useProgress();
  const navigate = useNavigate();

  const lesson = LESSON_MAP.get(lessonId);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);
  const [phase, setPhase] = useState<QuizPhase>("answering");

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

  const questions = lesson.quiz;
  const question = questions[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;

  const roadmap = progress?.roadmap ?? LESSONS.map((l) => l.id);
  const nextLessonId = roadmap[roadmap.indexOf(lessonId) + 1];

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSelect = (idx: number) => {
    if (selected !== null) return; // already answered this question
    setSelected(idx);
  };

  const handleNext = async () => {
    if (selected === null) return;

    const isCorrect = selected === question.correctIndex;
    const newAnswers = [
      ...answers,
      { questionId: question.id, selectedIndex: selected, isCorrect },
    ];

    if (!isLastQuestion) {
      // Move to next question
      setAnswers(newAnswers);
      setSelected(null);
      setCurrentQ((q) => q + 1);
      return;
    }

    // Quiz complete — calculate score
    const correctCount = newAnswers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 50; // must get at least 1 of 2 correct

    // Persist
    if (user) {
      await saveQuizResult(user.uid, {
        lessonId,
        answers: newAnswers,
        score,
        passed,
        attempt: 1,
      });

      if (passed) {
        await markLessonComplete(lessonId, score);
      }
    }

    setAnswers(newAnswers);
    setPhase(passed ? "passed" : "failed");
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setPhase("answering");
  };

  // ── Result screen ────────────────────────────────────────────────────────────

  if (phase === "passed") {
    const score = Math.round(
      (answers.filter((a) => a.isCorrect).length / questions.length) * 100,
    );

    return (
      <div className="max-w-md mx-auto pt-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <div className="grid h-20 w-20 mx-auto place-items-center rounded-3xl bg-primary-soft text-primary mb-6">
            <Trophy className="h-10 w-10" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Quiz Passed! 🎉
          </h1>
          <p className="text-muted-foreground mb-2">
            You scored <span className="font-bold text-primary">{score}%</span>{" "}
            on {lesson.title.split(":")[0]}.
          </p>
          {nextLessonId && (
            <p className="text-sm text-muted-foreground mb-8">
              Next lesson is now unlocked!
            </p>
          )}

          <div className="flex flex-col gap-3">
            {nextLessonId && (
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-brand hover:opacity-90 h-12"
              >
                <Link
                  to="/app/lessons/$lessonId"
                  params={{ lessonId: nextLessonId }}
                >
                  Start Next Lesson
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full h-12"
            >
              <Link to="/app/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "failed") {
    const incorrectAnswers = answers.filter((a) => !a.isCorrect);

    return (
      <div className="max-w-md mx-auto pt-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="grid h-20 w-20 mx-auto place-items-center rounded-3xl bg-destructive/10 text-destructive mb-6">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Not quite yet
          </h1>
          <p className="text-muted-foreground">
            You need to get at least 1 question correct. Review the lesson and
            try again!
          </p>
        </motion.div>

        {/* Show wrong answers with explanations */}
        <div className="space-y-3 mb-8">
          {incorrectAnswers.map((ans) => {
            const q = questions.find((q) => q.id === ans.questionId);
            if (!q) return null;
            return (
              <div
                key={ans.questionId}
                className="card-surface p-4 border-destructive/20 bg-destructive/5"
              >
                <p className="text-sm font-medium text-foreground mb-2">
                  {q.question}
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  Your answer:{" "}
                  <span className="text-destructive font-medium">
                    {q.options[ans.selectedIndex]}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Correct answer:{" "}
                  <span className="text-primary font-medium">
                    {q.options[q.correctIndex]}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-brand hover:opacity-90 h-12"
          >
            <Link to="/app/lessons/$lessonId" params={{ lessonId }}>
              Review Lesson
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12"
            onClick={handleRetry}
          >
            <RotateCcw className="h-4 w-4" />
            Retry Quiz
          </Button>
        </div>
      </div>
    );
  }

  // ── Quiz answering ───────────────────────────────────────────────────────────

  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === question.correctIndex;

  return (
    <div className="max-w-lg mx-auto pb-16">
      {/* Back */}
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="rounded-full -ml-2">
          <Link to="/app/lessons/$lessonId" params={{ lessonId }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Lesson
          </Link>
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">
            Question {currentQ + 1} of {questions.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {lesson.title.split(":")[0]}
          </p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-brand transition-all duration-500"
            style={{
              width: `${((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-surface p-6 mb-5">
            <h2 className="text-lg font-semibold text-foreground leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              let state: "default" | "selected" | "correct" | "wrong" =
                "default";
              if (isAnswered) {
                if (idx === question.correctIndex) state = "correct";
                else if (idx === selected) state = "wrong";
              } else if (selected === idx) {
                state = "selected";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full text-left rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all duration-200",
                    state === "default" &&
                      "border-border bg-card hover:border-primary/50 hover:bg-primary-soft/30",
                    state === "correct" &&
                      "border-primary bg-primary-soft text-primary",
                    state === "wrong" &&
                      "border-destructive bg-destructive/10 text-destructive",
                    state === "selected" &&
                      "border-primary bg-primary-soft text-primary",
                    isAnswered && "cursor-default",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
                        state === "correct" && "border-primary bg-primary text-primary-foreground",
                        state === "wrong" && "border-destructive bg-destructive text-destructive-foreground",
                        state === "default" && "border-border",
                      )}
                    >
                      {state === "correct" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : state === "wrong" ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl px-4 py-3.5 mb-5 text-sm",
                  isCorrect
                    ? "bg-primary-soft border border-primary/20 text-foreground"
                    : "bg-destructive/10 border border-destructive/20 text-foreground",
                )}
              >
                <p className="font-semibold mb-1">
                  {isCorrect ? "✅ Correct!" : "❌ Not quite."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            size="lg"
            className="w-full rounded-full bg-gradient-brand hover:opacity-90 h-12 text-base"
          >
            {isLastQuestion ? "Submit Quiz" : "Next Question"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
