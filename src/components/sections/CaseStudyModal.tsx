import { motion } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/content.functions";

export function hasCaseStudy(p: Project) {
  return Boolean(p.problem || p.solution || p.challenges || p.learning || p.features.length);
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{body}</p>
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-xl sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-3xl rounded-2xl border border-border glass p-6 sm:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-4 top-4 rounded-full border border-border bg-white/10 p-2 text-foreground transition hover:border-cyan/50 hover:text-cyan"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {project.year && <span>{project.year}</span>}
          <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-cyan">
            {project.status}
          </span>
        </div>

        <h3 className="mt-3 pr-10 font-display text-2xl font-bold tracking-tight sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {project.problem && <Block label="Problem" body={project.problem} />}
          {project.solution && <Block label="Solution" body={project.solution} />}
          {project.challenges && <Block label="Challenges" body={project.challenges} />}
          {project.learning && <Block label="What I learned" body={project.learning} />}
        </div>

        {project.features.length > 0 && (
          <div className="mt-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
              Key features
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-foreground/80">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(project.github_url || project.live_url) && (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition hover:border-cyan/50 hover:text-cyan"
              >
                <Github className="h-3.5 w-3.5" /> source
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan transition hover:bg-cyan/20"
              >
                <ExternalLink className="h-3.5 w-3.5" /> live demo
              </a>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
