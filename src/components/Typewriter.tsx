import { useEffect, useRef, useState } from "react";

export function Typewriter({
  text,
  speed = 45,
  startDelay = 300,
  className,
  loop = false,
  holdDelay = 1600,
  deleteSpeed = 25,
}: {
  text: string | string[];
  speed?: number;
  startDelay?: number;
  className?: string;
  loop?: boolean;
  holdDelay?: number;
  deleteSpeed?: number;
}) {
  const [shown, setShown] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const phrases = Array.isArray(text) ? text.filter(Boolean) : [text];
    if (!phrases.length) return;

    let phrase = 0;
    let i = 0;
    let deleting = false;
    let cancelled = false;

    const schedule = (fn: () => void, ms: number) => {
      timer.current = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const tick = () => {
      const current = phrases[phrase]!;
      if (!deleting) {
        i += 1;
        setShown(current.slice(0, i));
        if (i < current.length) return schedule(tick, speed);
        if (!loop || phrases.length === 0) return;
        deleting = true;
        return schedule(tick, holdDelay);
      }
      i -= 1;
      setShown(current.slice(0, Math.max(i, 0)));
      if (i > 0) return schedule(tick, deleteSpeed);
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      schedule(tick, speed * 4);
    };

    schedule(tick, startDelay);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [JSON.stringify(text), speed, startDelay, loop, holdDelay, deleteSpeed]);

  return <span className={`caret ${className ?? ""}`}>{shown}</span>;
}
