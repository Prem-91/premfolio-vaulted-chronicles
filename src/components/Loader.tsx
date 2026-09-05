import { useEffect, useState } from "react";

/**
 * Intro curtain: blueprint canvas, letters of the name appearing one by one,
 * then the whole panel lifting away — matching the reference's opening.
 */
export function Loader({ text = "PREM SHINDE" }: { text?: string }) {
  const [shown, setShown] = useState(0);
  const [lift, setLift] = useState(false);
  const [gone, setGone] = useState(false);
  const letters = text.split("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const step = 110;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= letters.length) clearInterval(timer);
    }, step);
    const liftAt = setTimeout(() => setLift(true), step * letters.length + 480);
    const goneAt = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
    }, step * letters.length + 1500);
    return () => {
      clearInterval(timer);
      clearTimeout(liftAt);
      clearTimeout(goneAt);
      document.body.style.overflow = "";
    };
  }, [letters.length]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{
        transform: lift ? "translate3d(0, -100%, 0)" : "none",
        transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative flex items-center">
        {letters.map((c, i) => (
          <span
            key={`${c}-${i}`}
            className="display-thin text-[clamp(1.6rem,6vw,3.4rem)] text-foreground/70"
            style={{
              marginRight: c === " " ? "0.6em" : "0.34em",
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "none" : "translate3d(0, 8px, 0)",
              transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {c === " " ? "\u00a0" : c}
          </span>
        ))}
      </div>
      <div
        className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 bg-border"
        style={{
          transformOrigin: "left",
          transform: `scaleX(${Math.min(shown / letters.length, 1)})`,
          transition: "transform 0.4s linear",
        }}
      />
    </div>
  );
}
