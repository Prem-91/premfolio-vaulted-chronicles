import { motion } from "framer-motion";
import { Hammer, Github } from "lucide-react";
import type { Project } from "@/lib/content.functions";

export function CurrentlyBuilding({ projects }: { projects: Project[] }) {
  const items = projects.filter((p) => p.status === "building");
  if (!items.length) return null;

  return (
    <section id="currently-building" className="relative w-full py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
          / currently building
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
          In <span className="text-cyan">progress</span>
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="border-gradient relative overflow-hidden rounded-2xl border border-border glass p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan">
                <Hammer className="h-3.5 w-3.5" />
                work in progress
                <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {p.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {p.github_url && (
                <a
                  href={p.github_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition hover:text-cyan"
                >
                  <Github className="h-3.5 w-3.5" /> follow along
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
