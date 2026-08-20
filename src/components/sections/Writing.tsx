import { motion } from "framer-motion";
import { PenLine, Clock } from "lucide-react";

const PLANNED = [
  "Notes on shipping an AI feature that people actually use",
  "GitOps for small teams: what I automated first",
  "Designing a data model before writing any UI",
];

export function Writing() {
  return (
    <section id="writing" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ writing</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-6xl">
          Notes &amp; <span className="text-cyan">write-ups</span>
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Technical articles on what I build and break. First pieces are in draft.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PLANNED.map((title, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="flex flex-col rounded-2xl border border-dashed border-border glass p-6"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <Clock className="h-3 w-3 text-cyan" /> coming soon
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-foreground/85">
                {title}
              </h3>
              <span className="mt-auto pt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <PenLine className="h-3 w-3" /> draft
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
