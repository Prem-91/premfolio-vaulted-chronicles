import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Download } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import { TypeLine, Reveal } from "@/components/Section";
import type { About } from "@/lib/content.functions";
import { siteContent } from "@/lib/site-content";
import { PROFILE } from "@/lib/profile";

export type HeroStats = {
  projects: number;
  technologies: number;
  roles: number;
  moments: number;
};

const STATS = [
  { big: "3+", label: "featured builds" },
  { big: "150+", label: "students reached" },
  { big: "8.41+", label: "academic performance" },
  { big: "5+", label: "community experiences" },
];

const TICKER = [
  "Python",
  "TypeScript",
  "React",
  "Node.js",
  "FastAPI",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "GitOps",
  "LLM Apps",
  "AWS",
  "Tailwind",
];

/** Waits for the intro curtain to lift before the hero plays. */
const INTRO = 1.9;

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1, delay: INTRO + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero({ about }: { about: About | null; stats: HeroStats }) {
  const content = siteContent(about);
  const name = about?.name ?? PROFILE.name;
  const tagline = about?.tagline ?? PROFILE.tagline;
  const resumeUrl = about?.resume_url ?? PROFILE.resumeUrl;
  const github = about?.github_url ?? PROFILE.github;
  const linkedin = about?.linkedin_url ?? PROFILE.linkedin;
  const location = about?.location ?? PROFILE.location;
  const focus = about?.current_focus ?? "Engineering portfolio";
  const parts = name.split(" ");

  const phrases = [tagline, ...content.hero_phrases].filter(Boolean);

  return (
    <>
      <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-70" />
        <div className="aurora" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 35%, oklch(0.985 0 0 / 0.85) 100%)",
          }}
        />

        <div className="rails relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-28 sm:px-10">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: INTRO - 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-full origin-left bg-border"
          />

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <p className="label">01. portfolio</p>
            <p className="label">{location}</p>
          </div>

          <h1 className="display-thin mt-8 text-[clamp(2.6rem,11vw,8.5rem)]">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                variants={line}
                custom={0}
                initial="hidden"
                animate="show"
              >
                {parts[0]}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block text-muted-foreground"
                variants={line}
                custom={1}
                initial="hidden"
                animate="show"
              >
                {parts.slice(1).join(" ")}
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: INTRO + 0.55, duration: 0.8 }}
            className="mt-10 grid gap-8 border-t border-border pt-8 lg:grid-cols-[1.1fr_1fr]"
          >
            <div>
              <p className="label">
                <TypeLine
                  text={content.hero_identity}
                  delay={INTRO + 0.7}
                  speed={22}
                />
              </p>
              <div className="mt-5 min-h-[3.2rem] font-display text-[clamp(1.1rem,3.4vw,1.9rem)] font-light tracking-wide text-foreground">
                <Typewriter text={phrases} startDelay={2900} loop speed={55} />
              </div>
            </div>

            <div className="lg:border-l lg:border-border lg:pl-8">
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {content.hero_statement}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 bg-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.28em] text-background"
                >
                  View work
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 border border-foreground/25 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.28em] transition hover:bg-ink hover:text-background"
                >
                  <Download className="h-3.5 w-3.5" /> Resume
                </a>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub"
                  className="inline-flex h-12 w-12 items-center justify-center border border-foreground/25 transition hover:bg-ink hover:text-background"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="inline-flex h-12 w-12 items-center justify-center border border-foreground/25 transition hover:bg-ink hover:text-background"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{content.education}</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1 w-1 animate-pulse bg-cyan" /> {focus}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: INTRO + 0.85, duration: 0.7 }}
            className="mt-12 grid grid-cols-2 border-t border-border sm:grid-cols-4"
          >
            {content.hero_stats.map((s, i) => (
              <Reveal
                key={s.label}
                variant="clip"
                duration={0.9}
                delay={INTRO + 0.9 + i * 0.1}
                amount={0.01}
                className={`border-b border-border px-4 py-6 sm:border-b-0 ${
                  i > 0 ? "sm:border-l" : ""
                } ${i % 2 === 1 ? "border-l" : ""}`}
              >
                <div className="display-thin text-3xl sm:text-4xl">{s.big}</div>
                <div className="label mt-3">{s.label}</div>
              </Reveal>
            ))}
          </motion.div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to about"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 animate-float text-muted-foreground"
        >
          <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <div className="overflow-hidden border-y border-border bg-ink py-3">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center">
              {content.ticker.map((t) => (
                <span
                  key={`${k}-${t}`}
                  className="mx-6 font-mono text-[10px] uppercase tracking-[0.3em] text-background/70"
                >
                  {t} <span className="ml-6 text-background/30">/</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
