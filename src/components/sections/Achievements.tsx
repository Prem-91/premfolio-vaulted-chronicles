import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { Achievement } from "@/lib/content.functions";
import { Section } from "@/components/Section";

export function Achievements({ items }: { items: Achievement[] }) {
  if (!items.length) return null;
  return (
    <Section
      id="achievements"
      index="07"
      label="achievements"
      title="Recognition, earned"
      intro="Milestones that matter because they represent consistency, service and curiosity."
    >
      <div className="border-t border-border">
        {items.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group grid gap-5 border-b border-border py-6 sm:grid-cols-[4rem_10rem_1fr] sm:items-start sm:gap-8"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-border transition-colors group-hover:border-cyan group-hover:bg-ink group-hover:text-background">
              <Award className="h-4 w-4" strokeWidth={1.4} />
            </span>
            <span className="label pt-2 text-cyan">{a.period ?? "—"}</span>
            <div>
              <h3 className="display-thin text-xl">{a.title}</h3>
              {a.org && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.org}</p>}
              {a.detail && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{a.detail}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
