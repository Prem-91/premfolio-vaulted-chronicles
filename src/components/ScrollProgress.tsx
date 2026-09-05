import { useEffect, useState } from "react";

/** Short vertical marker riding the right edge, as in the reference. */
export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);
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
    <div aria-hidden className="pointer-events-none fixed right-0 top-0 z-[70] hidden h-screen w-[3px] sm:block">
      <div
        className="absolute right-0 h-[14vh] w-[3px] bg-ink"
        style={{
          top: `calc(${p * 100}% - ${p * 14}vh)`,
          transition: "top 0.12s linear",
        }}
      />
    </div>
  );
}
