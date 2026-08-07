import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const faqs = [
  {
    q: "Is my bank statement secure?",
    a: "Yes. Uploads are encrypted in transit and at rest with AES-256, processed in an isolated environment, and never shared with advertisers or data brokers.",
  },
  {
    q: "Do you store my financial information?",
    a: "We keep only the anonymized spending patterns needed to build your roadmap. The original document can be deleted the moment analysis finishes, and you can wipe your data at any time from settings.",
  },
  {
    q: "Can beginners use this?",
    a: "It's built for beginners. The first lesson is calibrated to your current level, uses plain language, and every term is explained with a number from your own statement.",
  },
  {
    q: "Do I need finance knowledge?",
    a: "None at all. If you can read your bank statement, you can start — and if you already know the basics, the AI skips them so you're never bored.",
  },
  {
    q: "How long are lessons?",
    a: "Most take 5 to 7 minutes, ending with one or two quick quiz questions. A typical roadmap is four weeks at three lessons per week.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading eyebrow="FAQ" title="Questions people ask before uploading" />
      </Reveal>

      <Reveal delayIndex={1}>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.q}
              value={faq.q}
              className="card-surface border px-5 data-[state=open]:shadow-lift"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
