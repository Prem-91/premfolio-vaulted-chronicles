import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import type { Experience as Item } from "@/lib/content.functions";

export function Experience({ items }: { items: Item[] }) {
  return (
    <section id="experience" className="relative w-full py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ journey</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Experience &amp; <span className="text-cyan">education</span>
        </h2>

        <div className="relative mt-16 pl-8 md:pl-12">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-cyan/60 via-border to-transparent md:left-4" />
          {items.map((item, i) => {
            const Icon = item.kind === "edu" ? GraduationCap : Briefcase;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative mb-10 last:mb-0"
              >
                <div className="absolute -left-[26px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-cyan/50 bg-background md:-left-[34px]">
                  <Icon className="h-3 w-3 text-cyan" />
                </div>
                <div className="rounded-xl border border-border glass p-5">
                  <div className="font-mono text-xs uppercase tracking-widest text-cyan">
                    {item.period}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{item.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
