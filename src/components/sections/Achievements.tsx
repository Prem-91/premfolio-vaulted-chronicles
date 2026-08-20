import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { Achievement } from "@/lib/content.functions";

export function Achievements({ items }: { items: Achievement[] }) {
  if (!items.length) return null;

  return (
    <section id="achievements" className="relative w-full py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ achievements</p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-6xl">
          Achievements &amp; <span className="text-cyan">recognition</span>
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="border-gradient flex gap-4 rounded-2xl border border-border glass p-5 transition hover:glow-cyan"
            >
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan">
                <Award className="h-4 w-4" />
              </span>
              <div>
                {a.period && (
                  <div className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                    {a.period}
                  </div>
                )}
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{a.title}</h3>
                {a.org && <p className="text-sm text-muted-foreground">{a.org}</p>}
                {a.detail && (
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{a.detail}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
