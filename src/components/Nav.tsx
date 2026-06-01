import { useEffect, useState } from "react";
import { PROFILE } from "@/lib/profile";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#experience", label: "Journey" },
  { href: "#skills", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition ${
        scrolled ? "border-b border-border bg-background/70 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          {PROFILE.initials}<span className="text-cyan">.</span>
        </a>
        <nav className="hidden gap-7 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-cyan">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={PROFILE.resumeUrl}
          download
          className="rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-cyan transition hover:bg-cyan/20"
        >
          Resume
        </a>
      </div>
    </header>
  );
}
