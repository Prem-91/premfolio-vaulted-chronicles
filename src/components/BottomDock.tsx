import { useEffect, useState } from "react";
import { Home, User, FolderGit2, GitBranch, Camera, Cpu, Mail } from "lucide-react";

const ITEMS = [
  { id: "top", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "projects", label: "Work", Icon: FolderGit2 },
  { id: "experience", label: "Journey", Icon: GitBranch },
  { id: "moments", label: "Moments", Icon: Camera },
  { id: "skills", label: "Stack", Icon: Cpu },
  { id: "contact", label: "Contact", Icon: Mail },
];

export function BottomDock() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current = "top";
      for (const it of ITEMS) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= mid) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3"
    >
      <div className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-border glass px-2 py-2 shadow-2xl sm:gap-1 sm:px-3">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
              className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition sm:h-11 sm:w-11 ${
                isActive
                  ? "bg-cyan/15 text-cyan"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-foreground opacity-0 transition group-hover:opacity-100">
                {label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-cyan" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
