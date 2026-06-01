import { useEffect, useState } from "react";

export function Typewriter({
  text,
  speed = 45,
  startDelay = 300,
  className,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const tick = () => {
        i += 1;
        setShown(text.slice(0, i));
        if (i < text.length) t = setTimeout(tick, speed);
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(t!);
    };
  }, [text, speed, startDelay]);

  return <span className={`caret ${className ?? ""}`}>{shown}</span>;
}
