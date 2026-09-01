import { useEffect, useRef } from "react";

/** Blueprint crosshair that tracks the pointer — drafting-table feel. */
export function CursorTrail() {
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;
      const { x, y } = pos.current;
      if (vRef.current) vRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      if (hRef.current) hRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] hidden lg:block">
      <div
        ref={vRef}
        className="absolute left-0 top-0 h-full w-px will-change-transform"
        style={{ background: "color-mix(in oklab, var(--cyan) 22%, transparent)" }}
      />
      <div
        ref={hRef}
        className="absolute left-0 top-0 h-px w-full will-change-transform"
        style={{ background: "color-mix(in oklab, var(--cyan) 22%, transparent)" }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 border border-cyan/60 will-change-transform"
      />
    </div>
  );
}
