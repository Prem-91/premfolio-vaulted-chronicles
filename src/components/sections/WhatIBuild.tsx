import { Brain, Layers, Cloud, Wrench } from "lucide-react";
import type { About } from "@/lib/content.functions";
import { siteContent } from "@/lib/site-content";
import { Section, Reveal } from "@/components/Section";

const CARDS = [
  {
    Icon: Brain,
    title: "AI Applications",
    detail:
      "LLM-powered tools, retrieval pipelines and assistive interfaces designed around a concrete user problem rather than a demo.",
  },
  {
    Icon: Layers,
    title: "Full-Stack Systems",
    detail:
      "End-to-end products: typed APIs, relational data models, auth, and interfaces that stay fast on a mid-range phone.",
  },
  {
    Icon: Cloud,
    title: "Cloud & Developer Tools",
    detail:
      "Containers, CI/CD and GitOps workflows — automating the boring parts so shipping stays repeatable and boring too.",
  },
  {
    Icon: Wrench,
    title: "Real-World Technology",
    detail:
      "Civic and campus-scale software: reporting, safety and sustainability tooling that has to work outside the browser tab.",
  },
];

export function WhatIBuild({ about }: { about: About | null }) {
  const cards = siteContent(about).build_cards;
  const icons = [Brain, Layers, Cloud, Wrench];
  return (
    <Section
      id="what-i-build"
      index="03"
      label="what i build"
      title="Four kinds of work"
      intro="A short map of the problems I keep coming back to."
    >
      <div className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, detail }, i) => { const Icon = icons[i % icons.length] ?? Wrench; return (
          <Reveal key={title} delay={i * 0.07}>
            <div
              className={`group h-full border-b border-border px-6 py-8 transition-colors duration-500 hover:bg-ink hover:text-background ${
                i > 0 ? "lg:border-l" : ""
              } ${i % 2 === 1 ? "sm:border-l lg:border-l" : ""}`}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5" strokeWidth={1.2} />
                <span className="font-mono text-[10px] tracking-[0.28em] opacity-50">
                  0{i + 1}
                </span>
              </div>
              <h3 className="display-thin mt-8 text-lg">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-background/70">
                {detail}
              </p>
            </div>
          </Reveal>
        ); })}
      </div>
    </Section>
  );
}
