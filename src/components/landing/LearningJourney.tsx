import { Star } from "lucide-react";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const skills = [
  { label: "Saving", score: 5 },
  { label: "Budgeting", score: 3 },
  { label: "Debt", score: 2 },
  { label: "Investments", score: 1 },
];

const roadmap = [
  { week: "Week 1", topic: "Debt Basics", text: "Interest, minimums, and payoff order." },
  { week: "Week 2", topic: "Emergency Fund", text: "How many months you actually need." },
  { week: "Week 3", topic: "Investments", text: "Index funds, risk, and time horizon." },
  { week: "Week 4", topic: "Advanced Budgeting", text: "Sinking funds and cash-flow timing." },
];

function Stars({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={
            n <= score ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/30"
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function LearningJourney() {
  return (
    <section id="learning-journey" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Learning Journey"
          title="One example roadmap. Yours will look different."
          description="Meet Maya. She saves consistently but carries a credit card balance, so her plan opens with debt — not budgeting 101."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal>
          <div className="card-surface h-full p-6">
            <h3 className="text-base font-semibold">Maya's skill snapshot</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Generated from 3 months of transactions.
            </p>
            <ul className="mt-6 space-y-4">
              {skills.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <Stars score={s.score} />
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-primary-soft p-4 text-sm leading-relaxed text-foreground">
              Because saving is already strong, FinMentor AI skips ahead and starts where the real
              cost is: high-interest debt.
            </p>
          </div>
        </Reveal>

        <Reveal delayIndex={1}>
          <div className="card-surface h-full p-6">
            <h3 className="text-base font-semibold">Her four-week plan</h3>
            <ol className="mt-6 space-y-4">
              {roadmap.map((r, i) => (
                <li key={r.week} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    {i < roadmap.length - 1 ? (
                      <span aria-hidden="true" className="mt-1 w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className="min-w-0 pb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {r.week}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{r.topic}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              Every user gets a different roadmap — and it re-orders itself whenever your habits
              shift.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
