import { motion } from "framer-motion";
import { PenLine, Clock } from "lucide-react";
import { Section } from "@/components/Section";

const PLANNED = [
  "Notes on shipping an AI feature that people actually use",
  "GitOps for small teams: what I automated first",
  "Designing a data model before writing any UI",
];

export function Writing() {
  return (
    <Section id="writing" index="10" label="writing" title="Notes & write-ups" intro="Technical articles on what I build, learn and break. First pieces are in draft.">
      <div className="grid border-t border-border sm:grid-cols-3">
        {PLANNED.map((title, i) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`flex min-h-56 flex-col border-b border-dashed border-border p-6 sm:p-8 ${i > 0 ? "sm:border-l" : ""}`}
          >
            <span className="label inline-flex items-center gap-2 text-cyan"><Clock className="h-3 w-3" /> coming soon</span>
            <h3 className="display-thin mt-8 text-lg leading-snug">{title}</h3>
            <span className="mt-auto flex items-center gap-2 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"><PenLine className="h-3 w-3" /> draft</span>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
