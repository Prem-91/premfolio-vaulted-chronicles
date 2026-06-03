import { motion } from "framer-motion";
import { ArrowDown, Download, ArrowRight } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import type { About } from "@/lib/content.functions";
import { PROFILE } from "@/lib/profile";

export function Hero({ about }: { about: About | null }) {
  const name = about?.name ?? PROFILE.name;
  const tagline = about?.tagline ?? PROFILE.tagline;
  const resumeUrl = about?.resume_url ?? PROFILE.resumeUrl;
  const parts = name.split(" ");

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 30%, color-mix(in oklab, var(--cyan) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-cyan"
        >
          ● Available for opportunities · Pune, India
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-6 font-display text-[clamp(2.8rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tighter"
        >
          {parts[0]}
          <br />
          <span className="text-glow text-cyan">{parts.slice(1).join(" ")}.</span>
        </motion.h1>

        <div className="mt-8 max-w-2xl font-mono text-base text-muted-foreground sm:text-lg">
          <Typewriter text={tagline} startDelay={900} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-cyan"
          >
            View Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:border-cyan/50 hover:text-cyan"
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </motion.div>

        <div className="mt-20 flex items-end justify-between gap-6 border-t border-border pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <div className="space-y-1">
            <div className="text-cyan/80">// stack</div>
            <div>React · Node · Python · Cloud · AI</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-cyan/80">// focus</div>
            <div>Full-stack · Backend · DevOps</div>
          </div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float text-cyan"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
