import { Bot, BrainCircuit, GraduationCap, LineChart, Receipt } from "lucide-react";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: BrainCircuit,
    title: "Personalized Learning",
    text: "AI analyzes your spending habits and prioritizes the topics you actually need.",
    detail:
      "Already great at saving? You'll start with investing or debt payoff instead of a beginner budgeting lesson.",
    tone: "bg-primary-soft text-primary",
    span: "lg:col-span-2",
  },
  {
    icon: Receipt,
    title: "Learn Using Your Own Transactions",
    text: "No generic textbook examples.",
    detail:
      "Every concept is illustrated with your real purchases — the $54 in delivery fees, the forgotten $12.99 subscription.",
    tone: "bg-brand-blue-soft text-brand-blue",
    span: "",
  },
  {
    icon: GraduationCap,
    title: "Adaptive Quizzes",
    text: "Each lesson ends with one or two quick checks.",
    detail: "Miss a question and you'll revisit the concept before the roadmap moves forward.",
    tone: "bg-brand-purple-soft text-brand-purple",
    span: "",
  },
  {
    icon: Bot,
    title: "AI Financial Mentor",
    text: "Ask anything, any time.",
    detail:
      "\u201cWhy do I need an emergency fund?\u201d \u00b7 \u201cWhere am I overspending?\u201d \u00b7 \u201cHow can I improve?\u201d",
    tone: "bg-primary-soft text-primary",
    span: "",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    text: "See momentum, not just numbers.",
    detail: "Financial Literacy Score, skill progress, achievements, and learning streaks.",
    tone: "bg-brand-blue-soft text-brand-blue",
    span: "",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Features"
          title="A finance course that studies you first"
          description="FinMentor AI turns your statement into a curriculum — then keeps adjusting it as your habits change."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delayIndex={i} className={f.span}>
            <article className="card-surface group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${f.tone}`}>
                <f.icon className="h-5.5 w-5.5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm font-medium text-foreground/80">{f.text}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
