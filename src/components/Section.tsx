import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
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
    <section id={id} className="relative w-full border-t border-border py-20 sm:py-28">
      <div
        className={`rails mx-auto px-5 sm:px-10 ${wide ? "max-w-[1400px]" : "max-w-[1180px]"}`}
      >
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-5">
            <div className="min-w-0">
              <p className="label">
                {index}. {label}
              </p>
              <h2 className="display-thin mt-4 text-[clamp(1.9rem,6vw,4rem)] text-foreground">
                {title}
              </h2>
              {intro && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {intro}
                </p>
              )}
            </div>
            {aside}
          </div>
        </Reveal>

        <div className="pt-10 sm:pt-14">{children}</div>
      </div>
    </section>
  );
}

/** Hairline card used across sections. */
export function Card({
  children,
  className = "",
  onMouseMove,
}: {
  children: ReactNode;
  className?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      onMouseMove={onMouseMove}
      className={`spotlight relative border border-border bg-background/60 transition-colors duration-500 hover:border-foreground/35 ${className}`}
    >
      {children}
    </div>
  );
}
