import { createContext, useContext, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

import type { SiteContent } from "@/lib/site-content";
const SiteContentContext = createContext<SiteContent | null>(null);
export const SiteContentProvider = SiteContentContext.Provider;

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Fires once when the element scrolls into view. Plain IntersectionObserver — SSR safe. */
export function useInView<T extends HTMLElement>(amount = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    // Safety net: never leave content permanently hidden.
    const fallback = setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setInView(true);
    }, 1200);
    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
  }, [amount]);

  return { ref, inView } as const;
}

type RevealVariant = "up" | "left" | "scale" | "clip" | "fade";

const HIDDEN: Record<RevealVariant, string> = {
  up: "translate3d(0, 26px, 0)",
  left: "translate3d(-18px, 0, 0)",
  scale: "scale(0.88)",
  clip: "translate3d(0, 26px, 0)",
  fade: "none",
};

/** Scroll reveal wrapper used across every section. */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  variant = "up",
  amount = 0.15,
  as: Tag = "div",
  className = "",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  amount?: number;
  as?: ElementType;
  className?: string;
} & Record<string, unknown>) {
  // NOTE: the observed element must never be clipped — a clip-path on the
  // observed node makes the browser report a zero intersection ratio, so the
  // reveal would never fire. Masking happens via opacity/transform only.
  const { ref, inView } = useInView<HTMLDivElement>(amount);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : HIDDEN[variant],
        transition: `opacity ${duration}s ${EASE} ${delay}s, transform ${duration}s ${EASE} ${delay}s, border-color 0.45s ease`,
        willChange: "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Word-by-word masked slide-up: the signature editorial heading reveal. */
export function MaskText({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.2);
  const words = text.split(" ");
  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em", marginRight: "0.26em" }}
        >
          <span
            className="inline-block"
            style={{
              transform: inView ? "translate3d(0,0,0)" : "translate3d(0,110%,0)",
              transition: `transform 1s ${EASE} ${delay + i * stagger}s`,
              willChange: "transform",
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Character-by-character reveal. `highlight` renders a solid ink block behind
 * the trailing phrase, the way the reference types a line then boxes a word.
 */
export function TypeLine({
  text,
  highlight,
  className = "",
  speed = 26,
  delay = 0,
}: {
  text: string;
  highlight?: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.2);
  const [count, setCount] = useState(0);
  const total = text.length;

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= total) clearInterval(timer);
      }, speed);
    }, delay * 1000);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [inView, total, speed, delay]);

  const done = count >= total;

  return (
    <span ref={ref} className={className}>
      <span>{text.slice(0, count)}</span>
      <span className="opacity-0">{text.slice(count)}</span>
      {!done && <span className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-foreground align-baseline" />}
      {highlight && (
        <span
          className="ml-2 inline-block px-2"
          style={{
            background: done ? "var(--ink)" : "transparent",
            color: done ? "var(--background)" : "transparent",
            clipPath: done ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: "clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, background 0.2s linear 0.2s, color 0.2s linear 0.2s",
          }}
        >
          {highlight}
        </span>
      )}
    </span>
  );
}

/** Hairline that draws left-to-right when scrolled into view. */
export function DrawRule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  return (
    <div
      ref={ref}
      className={`h-px w-full bg-border ${className}`}
      style={{
        transformOrigin: "left",
        transform: inView ? "scaleX(1)" : "scaleX(0)",
        transition: `transform 1.1s ${EASE} ${delay}s`,
      }}
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
  const copy = useContext(SiteContentContext);
  return (
    <section id={id} className="relative w-full py-20 sm:py-28">
      <DrawRule className="absolute inset-x-0 top-0" />
      <div className={`rails mx-auto px-5 sm:px-10 ${wide ? "max-w-[1400px]" : "max-w-[1180px]"}`}>
        <div className="flex flex-wrap items-end justify-between gap-6 pb-5">
          <div className="min-w-0">
            <Reveal duration={0.7}>
              <p className="label">
                {index}. {label}
              </p>
            </Reveal>
            <h2 className="display-thin mt-4 text-[clamp(1.9rem,6vw,4rem)] text-foreground">
              <MaskText text={copy?.section_titles?.[id] ?? title} />
            </h2>
            {intro && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                <TypeLine text={intro} delay={0.25} speed={14} />
              </p>
            )}
          </div>
          {aside && (
            <Reveal delay={0.22} duration={0.7}>
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
  return (
    <Reveal
      variant="clip"
      delay={delay}
      duration={1}
      onMouseMove={onMouseMove}
      className={`spotlight relative border border-border bg-background/60 transition-colors duration-500 hover:border-foreground/35 ${className}`}
    >
      {children}
    </Reveal>
  );
}
