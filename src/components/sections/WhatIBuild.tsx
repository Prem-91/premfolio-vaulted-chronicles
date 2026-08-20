import { motion } from "framer-motion";
import { Brain, Layers, Cloud, Wrench } from "lucide-react";

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

export function WhatIBuild() {
  return (
    <section id="what-i-build" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ what i build</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-6xl">
          Four kinds of <span className="text-cyan">work</span>
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ Icon, title, detail }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="border-gradient group flex flex-col rounded-2xl border border-border glass p-6 transition hover:glow-cyan"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold transition-colors group-hover:text-cyan">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
