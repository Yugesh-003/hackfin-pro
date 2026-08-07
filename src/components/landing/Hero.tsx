import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroDashboard } from "./HeroDashboard";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hero-glow pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI financial literacy, built around your money
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            Learn Finance Through{" "}
            <span className="text-gradient-brand">Your Own Spending.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload your bank statement and let AI identify what you should learn first. Get
            personalized lessons, real-life examples from your own transactions, quizzes, and an AI
            mentor that guides you toward financial literacy.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full bg-gradient-brand px-7 text-base shadow-lift hover:opacity-90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border bg-card/70 px-7 text-base backdrop-blur"
              asChild
            >
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Bank-grade encryption. Your statement is analyzed, never sold.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}
