import { useEffect, useState } from "react";

/**
 * Individual blueprint cells that outline themselves as you scroll, plus the
 * small crosshair ticks at grid intersections — the reference's background.
 */
const CELLS = [
  { left: "18%", top: "16%", w: 240, h: 200, d: 0 },
  { left: "62%", top: "9%", w: 180, h: 180, d: 0.2 },
  { left: "8%", top: "52%", w: 160, h: 240, d: 0.35 },
  { left: "74%", top: "58%", w: 220, h: 200, d: 0.5 },
  { left: "42%", top: "78%", w: 200, h: 160, d: 0.65 },
];

const CROSS = [
  { left: "24%", top: "22%" },
  { left: "50%", top: "12%" },
  { left: "80%", top: "38%" },
  { left: "16%", top: "68%" },
  { left: "58%", top: "84%" },
];

export function GridCells() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      {CELLS.map((c, i) => {
        const on = progress > c.d * 0.75;
        return (
          <div
            key={i}
            className="absolute border border-border"
            style={{
              left: c.left,
              top: c.top,
              width: c.w,
              height: c.h,
              opacity: on ? 0.85 : 0,
              clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 100% 0)",
              transition: "clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease",
            }}
          />
        );
      })}
      {CROSS.map((c, i) => (
        <div
          key={`x-${i}`}
          className="absolute"
          style={{
            left: c.left,
            top: c.top,
            opacity: 0.5,
            transform: `translate3d(0, ${progress * -30}px, 0)`,
          }}
        >
          <div className="absolute left-[-5px] top-0 h-px w-[11px] bg-border" />
          <div className="absolute left-0 top-[-5px] h-[11px] w-px bg-border" />
        </div>
      ))}
    </div>
  );
}
