import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { useTransactions } from "@/hooks/useTransactions";
import { analyzeTransactions } from "@/engine/analysisEngine";
import { LESSON_MAP } from "@/data/lessons";
import { chatWithMentor } from "@/lib/groq";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor — FinMentor AI" }] }),
  component: MentorPage,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STARTER_QUESTIONS = [
  "Why do I keep overspending on food?",
  "How do I start investing with a small salary?",
  "What should I focus on learning next?",
  "How much should I have in my emergency fund?",
  "Why is my financial health score low?",
];

function MentorPage() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { transactions } = useTransactions();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your FinMentor AI — your personal financial literacy coach. I have access to your financial profile and learning progress, so I can give you advice that's actually relevant to your situation. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const profile =
    user && transactions.length > 0
      ? analyzeTransactions(user.uid, transactions)
      : null;

  const completedLessons =
    progress?.lessonProgress
      .filter((lp) => lp.status === "completed")
      .map((lp) => LESSON_MAP.get(lp.lessonId)?.title ?? lp.lessonId) ?? [];

  const currentLesson = progress?.currentLessonId
    ? (LESSON_MAP.get(progress.currentLessonId)?.title ?? null)
    : null;

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg]
        .slice(-11) // keep last 10 + current
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply } = await chatWithMentor({
        data: {
          messages: chatHistory,
          financialProfile: profile
            ? {
                savingsRate: profile.savingsRate,
                highestExpenseCategory: profile.highestExpenseCategory,
                monthlyIncome: profile.monthlyIncome,
                monthlyExpenses: profile.monthlyExpenses,
                observations: profile.observations,
              }
            : null,
          completedLessons,
          currentLesson,
        },
      });

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I'm having a little trouble right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] pb-2">
      <PageHeader
        title="AI Mentor"
        description="Ask anything about your finances, lessons, or learning journey."
        className="mb-4"
      />

      {/* Chat container */}
      <div className="flex-1 flex flex-col card-surface overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === "user" && "flex-row-reverse",
                )}
              >
                {/* Avatar */}
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm",
                    msg.role === "assistant"
                      ? "bg-gradient-brand text-primary-foreground"
                      : "bg-brand-blue-soft text-brand-blue",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </span>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "assistant"
                      ? "bg-muted text-foreground rounded-tl-sm"
                      : "bg-primary-soft text-foreground rounded-tr-sm",
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3.5">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Starter chips — only show if just welcome message */}
        {messages.length === 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-border px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your finances…"
              disabled={loading}
              className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:bg-card transition-all"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              size="icon"
              className="rounded-full bg-gradient-brand hover:opacity-90 h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            AI guidance only — not a substitute for a certified financial advisor
          </p>
        </div>
      </div>
    </div>
  );
}
