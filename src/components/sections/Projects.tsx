import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, FileText } from "lucide-react";
import type { Project } from "@/lib/content.functions";
import { ALL_CATEGORIES } from "@/lib/profile";
import { CaseStudyModal, hasCaseStudy } from "./CaseStudyModal";
import { Section, Reveal, Card } from "@/components/Section";

const FILTERS = ["All", ...ALL_CATEGORIES] as const;

function spotlight(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );

  return (
    <>
      <Section
        id="projects"
        index="04"
        label="work"
        title="Featured builds"
        wide
        aside={
          <div className="flex flex-wrap gap-px">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition ${
                  filter === f
                    ? "border-ink bg-ink text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                exit={{ opacity: 0, y: -8 }}
                className={p.featured || i === 0 ? "md:col-span-4" : "md:col-span-2"}
              >
                <Card
                  delay={(i % 4) * 0.08}
                  onMouseMove={spotlight}
                  className="group flex h-full flex-col p-6 sm:p-8"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label">
                      {String(i + 1).padStart(2, "0")} {p.year ? `/ ${p.year}` : ""}
                    </span>
                    <span className="border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="display-thin mt-6 text-[clamp(1.4rem,3.4vw,2.3rem)] transition-colors">
                    {p.name}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {(p.github_url || p.live_url || hasCaseStudy(p)) && (
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                      {hasCaseStudy(p) && (
                        <button
                          type="button"
                          onClick={() => setCaseStudy(p)}
                          className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-background"
                        >
                          <FileText className="h-3.5 w-3.5" /> case study
                        </button>
                      )}
                      {p.live_url && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 border border-foreground/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] transition hover:bg-ink hover:text-background"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> live
                        </a>
                      )}
                      {p.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 border border-foreground/25 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] transition hover:bg-ink hover:text-background"
                        >
                          <Github className="h-3.5 w-3.5" /> source
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!filtered.length && (
          <Reveal>
            <p className="border border-border p-8 text-sm text-muted-foreground">
              Nothing in this category yet.
            </p>
          </Reveal>
        )}
      </Section>

      <AnimatePresence>
        {caseStudy && <CaseStudyModal project={caseStudy} onClose={() => setCaseStudy(null)} />}
      </AnimatePresence>
    </>
  );
}
