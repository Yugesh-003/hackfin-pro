import {
  Award,
  Bot,
  ClipboardCheck,
  Map,
  ScanSearch,
  Sparkles,
  Upload,
} from "lucide-react";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const steps = [
  { icon: Upload, title: "Upload Bank Statement", text: "PDF or CSV from any bank." },
  { icon: ScanSearch, title: "AI analyzes spending", text: "Habits, gaps and risk areas." },
  { icon: Map, title: "Personalized roadmap", text: "Ordered by what you need most." },
  { icon: Sparkles, title: "Bite-sized lessons", text: "5 minutes, your own examples." },
  { icon: ClipboardCheck, title: "Take quizzes", text: "Prove it before you move on." },
  { icon: Bot, title: "Chat with AI mentor", text: "Answers grounded in your data." },
  { icon: Award, title: "Financially confident", text: "A score that keeps climbing." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it Works"
            title="From statement to confidence in seven steps"
            description="No spreadsheets, no jargon dump. Just a guided path that starts with the money you already spent."
          />
        </Reveal>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute left-6 top-0 hidden h-full w-px bg-border sm:block lg:left-0 lg:top-7 lg:h-px lg:w-full"
          />
          <ol className="relative grid gap-6 sm:gap-8 lg:grid-cols-7">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delayIndex={i}>
                <div className="flex items-start gap-4 lg:block">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-primary shadow-soft lg:mx-auto">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-gradient-brand text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </span>
                  <div className="min-w-0 lg:mt-4 lg:text-center">
                    <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
