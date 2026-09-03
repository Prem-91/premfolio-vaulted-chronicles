import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import type { Experience as Item } from "@/lib/content.functions";
import { Section } from "@/components/Section";

export function Experience({ items }: { items: Item[] }) {
  return (
    <Section
      id="experience"
      index="06"
      label="journey"
      title="Experience & education"
      intro="The places, people and disciplines that shaped how I build."
    >
      <div className="relative border-t border-border">
        <div className="absolute bottom-0 left-5 top-0 w-px bg-border sm:left-8" />
        {items.map((item, i) => {
          const Icon = item.kind === "edu" ? GraduationCap : Briefcase;
          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="relative grid gap-5 border-b border-border py-7 pl-14 sm:grid-cols-[10rem_1fr] sm:gap-10 sm:pl-16"
            >
              <span className="absolute left-2.5 top-8 flex h-5 w-5 items-center justify-center border border-cyan bg-background sm:left-[18px]">
                <Icon className="h-3 w-3 text-cyan" />
              </span>
              <div className="label pt-1 text-cyan">{item.period}</div>
              <div>
                <h3 className="display-thin text-xl sm:text-2xl">{item.title}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.org} · {item.kind === "edu" ? "education" : "experience"}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
