import { motion } from "framer-motion";
import { ArrowDown, Download, ArrowRight, Github, Linkedin, Sparkles } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import { Starfield } from "@/components/Starfield";
import type { About } from "@/lib/content.functions";
import { PROFILE } from "@/lib/profile";

const STATS = [
  { big: "10+", label: "projects shipped" },
  { big: "AI", label: "+ realtime systems" },
  { big: "∞", label: "hackathon builds" },
  { big: "FS", label: "full-stack depth" },
];

export function Hero({ about }: { about: About | null }) {
  const name = about?.name ?? PROFILE.name;
  const tagline = about?.tagline ?? PROFILE.tagline;
  const resumeUrl = about?.resume_url ?? PROFILE.resumeUrl;
  const github = about?.github_url ?? PROFILE.github;
  const linkedin = about?.linkedin_url ?? PROFILE.linkedin;
  const parts = name.split(" ");

  const phrases = [
    tagline,
    "Building backend systems",
    "Shipping full-stack products",
    "Exploring AI & cloud",
  ].filter(Boolean);

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden scanlines">
      {/* Layered ambient backdrop */}
      <div className="aurora" />
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <Starfield />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 8%, color-mix(in oklab, oklch(0.6 0.18 285) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="beam pointer-events-none absolute inset-x-0 top-0 h-[60vh]" />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, oklch(0.08 0.01 250 / 0.75) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-cyan backdrop-blur sm:text-[10px] sm:tracking-[0.3em]"
        >
          <Sparkles className="h-3 w-3 shrink-0" />
          Available for work · Engineering portfolio
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mx-auto mt-6 max-w-5xl font-display text-[clamp(2.6rem,11vw,7rem)] font-bold leading-[0.95] tracking-tighter"
        >
          <span className="text-foreground">{parts[0]}</span>{" "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(100deg, var(--cyan) 0%, oklch(0.8 0.13 210) 45%, oklch(0.65 0.18 285) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {parts.slice(1).join(" ")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs"
        >
          Full-stack · Backend · Cloud &amp; AI
        </motion.p>

        <div className="mx-auto mt-6 min-h-[3.5rem] max-w-3xl font-display text-xl text-cyan sm:text-3xl">
          <Typewriter text={phrases} startDelay={800} loop speed={55} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:glow-cyan sm:px-6"
          >
            <span className="relative z-10">View Work</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:border-cyan/50 hover:text-cyan sm:px-6"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
          <a
            href={github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/5 text-muted-foreground transition hover:border-cyan/50 hover:text-cyan"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/5 text-muted-foreground transition hover:border-cyan/50 hover:text-cyan"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mx-auto mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="border-gradient rounded-2xl border border-border glass px-3 py-5 transition hover:glow-cyan"
            >
              <div className="font-display text-2xl font-bold text-cyan sm:text-3xl">{s.big}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground sm:text-[10px]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-float text-cyan"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
