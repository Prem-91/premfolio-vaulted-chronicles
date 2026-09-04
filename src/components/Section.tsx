import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

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
      { threshold: Math.min(Math.max(amount, 0), 0.95), rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
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
  const { ref, inView } = useInView<HTMLDivElement>(amount);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : HIDDEN[variant],
        clipPath: variant === "clip" ? (inView ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)") : undefined,
        transition: `opacity ${duration}s ${EASE} ${delay}s, transform ${duration}s ${EASE} ${delay}s, clip-path ${duration}s ${EASE} ${delay}s`,
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
              <MaskText text={title} />
            </h2>
            {intro && (
              <Reveal delay={0.18} duration={0.8}>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {intro}
                </p>
              </Reveal>
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
