import { useEffect, useState } from "react";
import { Home, User, FolderGit2, GitBranch, Award, Camera, Cpu, PenLine, Mail } from "lucide-react";

const ITEMS = [
  { id: "top", label: "Home", Icon: Home }, { id: "about", label: "About", Icon: User }, { id: "projects", label: "Work", Icon: FolderGit2 },
  { id: "experience", label: "Experience", Icon: GitBranch }, { id: "achievements", label: "Achievements", Icon: Award }, { id: "moments", label: "Beyond the Code", Icon: Camera },
  { id: "skills", label: "Stack", Icon: Cpu }, { id: "writing", label: "Writing", Icon: PenLine }, { id: "contact", label: "Contact", Icon: Mail },
];

export function BottomDock() {
  const [active, setActive] = useState("top");
  useEffect(() => { const onScroll = () => { const mid = window.innerHeight * 0.4; let current = "top"; for (const it of ITEMS) { const el = document.getElementById(it.id); if (el && el.getBoundingClientRect().top <= mid) current = it.id; } setActive(current); }; onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <nav aria-label="Section navigation" className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3"><div className="flex max-w-full items-stretch overflow-x-auto border border-ink bg-background/90 shadow-sm backdrop-blur-md">{ITEMS.map(({ id, label, Icon }, i) => { const isActive = active === id; return <a key={id} href={`#${id}`} aria-label={label} aria-current={isActive ? "true" : undefined} className={`group relative flex h-10 w-10 shrink-0 items-center justify-center transition sm:h-11 sm:w-11 ${i > 0 ? "border-l border-border" : ""} ${isActive ? "bg-ink text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-4 w-4" strokeWidth={1.4} /><span className="pointer-events-none absolute -top-8 whitespace-nowrap border border-border bg-background px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground opacity-0 transition group-hover:opacity-100">{label}</span></a>; })}</div></nav>;
}
