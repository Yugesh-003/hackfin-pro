import { Check, X } from "lucide-react";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const traditional = [
  "Generic tips",
  "Same content for everyone",
  "Only track expenses",
  "No learning validation",
];

const ours = [
  "Personalized lessons",
  "Based on your own bank statement",
  "Adaptive learning",
  "AI mentor",
  "Quizzes",
  "Progress tracking",
];

export function WhyDifferent() {
  return (
    <section className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why this is different"
            title="Tracking isn't teaching"
            description="Most finance apps show you what happened. FinMentor AI explains it, then makes sure you understood."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-card/60 p-6">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Traditional finance apps
              </h3>
              <ul className="mt-5 space-y-3">
                {traditional.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delayIndex={1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-primary/30 bg-card p-6 shadow-lift">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-brand"
              />
              <h3 className="text-lg font-semibold text-foreground">FinMentor AI</h3>
              <ul className="mt-5 space-y-3">
                {ours.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
