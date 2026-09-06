import { motion } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/content.functions";

export function hasCaseStudy(p: Project) {
  return Boolean(p.problem || p.solution || p.challenges || p.learning || p.features.length);
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div className="border-t border-border pt-5">
      <div className="label">{label}</div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-0 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-4xl border border-border bg-background p-6 sm:p-12"
      >
        <button
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center border-b border-l border-border transition hover:bg-ink hover:text-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-4 pr-12">
          <span className="label">case study</span>
          <span className="border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {project.status}
          </span>
        </div>

        <h3 className="display-thin mt-6 text-[clamp(1.8rem,6vw,3.4rem)]">{project.name}</h3>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {project.problem && <Block label="Problem" body={project.problem} />}
          {project.solution && <Block label="Solution" body={project.solution} />}
          {project.challenges && <Block label="Challenges" body={project.challenges} />}
          {project.learning && <Block label="What I learned" body={project.learning} />}
        </div>

        {project.features.length > 0 && (
          <div className="mt-10 border-t border-border pt-6">
            <div className="label">Key features</div>
            <ul className="mt-4 grid gap-px sm:grid-cols-2">
              {project.features.map((f, i) => (
                <li
                  key={f}
                  className="flex gap-4 border-b border-border py-3 text-sm text-muted-foreground"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(project.github_url || project.live_url) && (
          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 bg-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-background"
              >
                <ExternalLink className="h-3.5 w-3.5" /> live demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-foreground/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] transition hover:bg-ink hover:text-background"
              >
                <Github className="h-3.5 w-3.5" /> source
              </a>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
