import { motion } from "framer-motion";
import type { SkillsGroup } from "@/lib/content.functions";
import { Section } from "@/components/Section";

export function Skills({ groups }: { groups: SkillsGroup[] }) {
  return (
    <Section
      id="skills"
      index="09"
      label="stack"
      title="Tools of the trade"
      intro="A practical toolkit, organised by the work it supports."
      wide
    >
      <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`border-b border-border p-6 sm:p-8 ${i % 2 ? "sm:border-l" : ""} lg:border-l ${i % 3 === 0 ? "lg:border-l-0" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="label text-cyan">{g.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{String(g.items.length).padStart(2, "0")}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {g.items.map((s) => (
                <span key={s} className="text-sm text-foreground transition-colors hover:text-cyan">{s}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
