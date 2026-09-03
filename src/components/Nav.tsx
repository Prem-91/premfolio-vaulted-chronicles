import { useEffect, useState } from "react";
import type { About } from "@/lib/content.functions";
import { PROFILE } from "@/lib/profile";

export const NAV_LINKS = [
  { href: "#top", label: "Home" }, { href: "#about", label: "About" }, { href: "#projects", label: "Work" },
  { href: "#experience", label: "Experience" }, { href: "#achievements", label: "Achievements" }, { href: "#moments", label: "Beyond the Code" },
  { href: "#skills", label: "Stack" }, { href: "#writing", label: "Writing" }, { href: "#contact", label: "Contact" },
];

export function Nav({ about }: { about: About | null }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 30); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  const initials = about?.initials ?? PROFILE.initials;
  const resumeUrl = about?.resume_url ?? PROFILE.resumeUrl;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b border-border transition-colors duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md" : "bg-background/60"}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-5 py-4 sm:px-10">
        <a href="#top" className="shrink-0 font-mono text-xs uppercase tracking-[0.3em]">{initials}<span className="text-cyan">/</span></a>
        <nav className="hidden min-w-0 items-center justify-center gap-5 xl:flex 2xl:gap-7">
          {NAV_LINKS.slice(1).map((l) => <a key={l.href} href={l.href} className="group relative whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground">{l.label}<span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-cyan transition-transform duration-500 group-hover:scale-x-100" /></a>)}
        </nav>
        <a href={resumeUrl} download className="shrink-0 border border-foreground/25 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition hover:bg-ink hover:text-background sm:px-4">Resume ↗</a>
      </div>
    </header>
  );
}
