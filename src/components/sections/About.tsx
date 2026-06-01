import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { PROFILE } from "@/lib/profile";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="relative w-full py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1fr_1.4fr] md:gap-16">
        {/* Portrait placeholder */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border glass">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 25%, transparent), transparent 60%), radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--cyan) 30%, transparent), transparent 50%)",
              }}
            />
            <div className="grid-bg absolute inset-0 opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-[12rem] font-bold leading-none text-glow text-cyan/80">
                {PROFILE.initials}
              </div>
              <div className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {PROFILE.name}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>// portrait_v1</span>
              <span className="text-cyan">live</span>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">/ about</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              A builder. <span className="text-cyan">A student.</span>
              <br />
              Always shipping.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {PROFILE.longBio}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-xs">
                <MapPin className="h-3.5 w-3.5 text-cyan" />
                {PROFILE.location} 🇮🇳
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 font-mono text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                Currently: CS student + freelance dev
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
