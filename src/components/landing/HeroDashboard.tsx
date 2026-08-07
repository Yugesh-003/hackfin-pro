import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

const bars = [42, 58, 51, 70, 64, 82, 91];

export function HeroDashboard() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2.5rem] bg-gradient-brand opacity-15 blur-3xl"
      />
      <div className="card-surface relative overflow-hidden p-4 shadow-lift sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="truncate text-sm font-semibold">Your learning dashboard</p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
            Live
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-brand-blue" />
              statement-march.pdf
            </div>
            <p className="mt-1 text-xs text-muted-foreground">248 transactions analyzed</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Dining out", value: "32%", tone: "text-brand-purple" },
                { label: "Subscriptions", value: "11%", tone: "text-brand-blue" },
                { label: "Savings", value: "18%", tone: "text-primary" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-semibold ${row.tone}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Literacy score</p>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-3xl font-bold text-gradient-brand">742</p>
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 6, opacity: 0.4 }}
                  animate={{ height: `${h}%`, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className="flex-1 rounded-t-md bg-gradient-brand"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">Your roadmap</p>
            <ul className="mt-3 space-y-2.5">
              {[
                { label: "Debt basics", done: true },
                { label: "Emergency fund", done: true },
                { label: "Index investing", done: false },
              ].map((step) => (
                <li key={step.label} className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${step.done ? "text-primary" : "text-muted-foreground/40"}`}
                  />
                  <span className={step.done ? "text-foreground" : "text-muted-foreground"}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-4 w-4 text-brand-purple" />
              AI mentor
            </div>
            <p className="mt-3 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-brand-blue-soft px-3 py-2 text-xs text-foreground">
              Where am I overspending?
            </p>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-2 w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-primary-soft px-3 py-2 text-xs text-foreground"
            >
              Food delivery is up 24% vs. February — that's $186. Let's cover the 50/30/20 rule
              next.
            </motion.p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-soft sm:flex"
      >
        <ArrowUpRight className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">+12 pts this week</span>
      </motion.div>
    </div>
  );
}
