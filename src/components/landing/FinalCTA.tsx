import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card p-8 text-center shadow-lift sm:p-14">
          <span aria-hidden="true" className="absolute inset-0 bg-hero-glow opacity-90" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-foreground sm:text-4xl">
              Start Your Personalized Financial Learning Journey Today
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Understand your money. Build better habits. Become financially confident.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-full bg-gradient-brand px-8 text-base shadow-lift hover:opacity-90"
              >
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border bg-card px-8 text-base"
              >
                Login
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Free to start · No card required · Delete your data anytime
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
