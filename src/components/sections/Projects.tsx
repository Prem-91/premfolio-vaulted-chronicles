import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/content.functions";
import { ALL_CATEGORIES } from "@/lib/profile";
import { CaseStudyModal, hasCaseStudy } from "./CaseStudyModal";
import { Section, Reveal } from "@/components/Section";
import { Button } from "@/components/ui/button";

const FILTERS = ["All", ...ALL_CATEGORIES] as const;

function spotlight(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

const PAGE_SIZE = 4;

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [caseStudy, setCaseStudy] = useState<Project | null>(null);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const shown = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const go = (step: number) => {
    setDir(step);
    setPage((prev) => (prev + step + pages) % pages);
  };

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
              <Button variant="ghost"
                key={f}
                onClick={() => { setFilter(f); setPage(0); }}
                className={`border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition ${
                  filter === f
                    ? "border-ink bg-ink text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {f}
              </Button>
            ))}
          </div>
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${filter}-${current}`} initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -24 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2">
            {shown.map((p, i) => (
              <motion.div
                key={`${current}-${p.id}`}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="min-w-0"
              >
                <div
                  onMouseMove={spotlight}
                  className="spotlight group relative flex h-full flex-col border border-border bg-background/60 p-6 sm:p-8"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label">
                      {String(current * PAGE_SIZE + i + 1).padStart(2, "0")}
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
                        <Button
                          type="button"
                          onClick={() => setCaseStudy(p)}
                          className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-background"
                        >
                          <FileText className="h-3.5 w-3.5" /> case study
                        </Button>
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
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {pages > 1 && (
          <div className="mt-px flex items-center justify-between border border-border">
            <div className="flex">
              <Button variant="ghost"
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous projects"
                className="flex h-12 w-12 items-center justify-center border-r border-border transition hover:bg-ink hover:text-background"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost"
                type="button"
                onClick={() => go(1)}
                aria-label="Next projects"
                className="flex h-12 w-12 items-center justify-center border-r border-border transition hover:bg-ink hover:text-background"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="label pr-4">
              {String(current + 1).padStart(2, "0")} / {String(pages).padStart(2, "0")}
            </span>
          </div>
        )}

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
