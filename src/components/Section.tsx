import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word masked slide-up, the signature xagilab heading reveal. */
export function MaskText({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="overflow-hidden py-[0.06em] pr-[0.28em] leading-[1.02]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Hairline that draws left-to-right when scrolled into view. */
export function DrawRule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`h-px w-full origin-left bg-border ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    />
  );
}

/** Editorial section shell: numbered label, thin uppercase title, hairline rules. */
export function Section({
  id,
  index,
  label,
  title,
  intro,
  aside,
  children,
  wide,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  intro?: string;
  aside?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className="relative w-full py-20 sm:py-28">
      <DrawRule className="absolute inset-x-0 top-0" />
      <div
        className={`rails mx-auto px-5 sm:px-10 ${wide ? "max-w-[1400px]" : "max-w-[1180px]"}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-6 pb-5">
          <div className="min-w-0">
            <Reveal y={10}>
              <p className="label">
                {index}. {label}
              </p>
            </Reveal>
            <h2 className="display-thin mt-4 text-[clamp(1.9rem,6vw,4rem)] text-foreground">
              <MaskText text={title} />
            </h2>
            {intro && (
              <Reveal delay={0.15} y={14}>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {intro}
                </p>
              </Reveal>
            )}
          </div>
          {aside && (
            <Reveal delay={0.2} y={10}>
              {aside}
            </Reveal>
          )}
        </div>
        <DrawRule delay={0.1} />

        <div className="pt-10 sm:pt-14">{children}</div>
      </div>
    </section>
  );
}

/** Hairline card used across sections — wipes open on scroll. */
export function Card({
  children,
  className = "",
  onMouseMove,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      onMouseMove={onMouseMove}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={`spotlight relative border border-border bg-background/60 transition-colors duration-500 hover:border-foreground/35 ${className}`}
    >
      {children}
    </motion.div>
  );
}
