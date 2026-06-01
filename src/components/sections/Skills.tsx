import { motion } from "framer-motion";
import { SKILLS } from "@/lib/profile";

export function Skills() {
  return (
    <section id="skills" className="relative w-full py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ stack</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Tools of the <span className="text-cyan">trade</span>
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SKILLS).map(([group, items], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: gi * 0.07 }}
              className="rounded-2xl border border-border glass p-6"
            >
              <div className="font-mono text-xs uppercase tracking-widest text-cyan">{group}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border bg-white/5 px-2.5 py-1 text-xs text-foreground/85 transition hover:border-cyan/40 hover:text-cyan"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
