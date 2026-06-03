import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import type { Project } from "@/lib/content.functions";
import { ALL_CATEGORIES } from "@/lib/profile";

const FILTERS = ["All", ...ALL_CATEGORIES] as const;

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );

  return (
    <section id="projects" className="relative w-full py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ work</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Selected <span className="text-cyan">projects</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                  filter === f
                    ? "border-cyan bg-cyan/15 text-cyan"
                    : "border-border bg-white/5 text-muted-foreground hover:border-cyan/40 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border glass p-6 transition hover:border-cyan/40 hover:glow-cyan md:p-8 ${
                  p.featured ? "md:col-span-4" : "md:col-span-3"
                } ${i === 0 ? "md:col-span-4" : ""}`}
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-30 transition group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, var(--cyan) 50%, transparent), transparent 70%)",
                  }}
                />
                <div className="relative flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  <span>{p.year}</span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 text-cyan">
                      <Star className="h-3 w-3" /> featured
                    </span>
                  )}
                </div>

                <h3 className="relative mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {p.name}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {p.description}
                </p>

                <div className="relative mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-border bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="relative mt-6 flex flex-wrap gap-3 pt-4">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition hover:text-cyan"
                    >
                      <Github className="h-3.5 w-3.5" /> source
                    </a>
                  )}
                  {p.live_url && (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyan"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> live demo
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
