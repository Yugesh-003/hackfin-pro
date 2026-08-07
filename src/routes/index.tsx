import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustSection } from "@/components/landing/TrustSection";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LearningJourney } from "@/components/landing/LearningJourney";
import { WhyDifferent } from "@/components/landing/WhyDifferent";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const title = "FinMentor AI — Learn Finance Through Your Own Spending";
const description =
  "Upload your bank statement and let AI build a personalized financial literacy roadmap: lessons from your real transactions, adaptive quizzes, and an AI money mentor.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <Features />
        <HowItWorks />
        <LearningJourney />
        <WhyDifferent />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
