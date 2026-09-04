import { useEffect } from "react";

/** Inertial smooth scrolling + top scroll-progress hairline (xagilab feel). */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const instance = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4, anchors: true } as never);
      lenis = instance as unknown as { raf: (t: number) => void; destroy: () => void };
      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
