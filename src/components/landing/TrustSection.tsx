import { Bot, Lock, Target, TrendingUp } from "lucide-react";

import { Reveal } from "./Reveal";

const items = [
  {
    icon: Lock,
    title: "Your bank data stays private",
    text: "Encrypted end to end, never shared or sold.",
    tone: "bg-primary-soft text-primary",
  },
  {
    icon: Bot,
    title: "AI-powered personalized education",
    text: "Lessons written around your real numbers.",
    tone: "bg-brand-blue-soft text-brand-blue",
  },
  {
    icon: TrendingUp,
    title: "Learn with your own financial habits",
    text: "Every example comes from your statement.",
    tone: "bg-brand-purple-soft text-brand-purple",
  },
  {
    icon: Target,
    title: "Adaptive learning path",
    text: "The roadmap rewrites itself as you improve.",
    tone: "bg-primary-soft text-primary",
  },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal as="li" key={item.title} delayIndex={i}>
            <div className="card-surface h-full p-5 transition-shadow hover:shadow-lift">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${item.tone}`}>
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
