import { Github } from "lucide-react";
import type { Project } from "@/lib/content.functions";
import { Section, Card } from "@/components/Section";

export function CurrentlyBuilding({ projects }: { projects: Project[] }) {
  const items = projects.filter((p) => p.status === "building");
  if (!items.length) return null;

  return (
    <Section
      id="currently-building"
      index="05"
      label="currently building"
      title="In progress"
      intro="Work that is still moving — shipped in the open."
    >
      <div className="grid gap-px md:grid-cols-2">
        {items.map((p, i) => (
          <Card key={p.id} delay={i * 0.08} className="flex h-full flex-col p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-cyan opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 bg-cyan" />
                </span>
                <span className="label">work in progress</span>
              </div>

              <h3 className="display-thin mt-8 text-[clamp(1.6rem,4vw,2.6rem)]">{p.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {p.github_url && (
                <a
                  href={p.github_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-auto inline-flex items-center gap-2 pt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground underline decoration-border underline-offset-4 transition hover:decoration-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> follow along
                </a>
              )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
