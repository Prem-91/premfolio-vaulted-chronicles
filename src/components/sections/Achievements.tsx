import { Award } from "lucide-react";
import type { Achievement } from "@/lib/content.functions";
import { Section, Reveal } from "@/components/Section";

export function Achievements({ items }: { items: Achievement[] }) {
  if (!items.length) return null;
  return (
    <Section
      id="achievements"
      index="06"
      label="achievements"
      title="Recognition, earned"
      intro="Milestones that matter because they represent consistency, service and curiosity."
    >
      <div className="border-t border-border">
        {items.map((a, i) => (
          <Reveal
            as="article"
            key={a.id}
            duration={0.8}
            delay={i * 0.06}
            className="group grid gap-5 border-b border-border py-6 sm:grid-cols-[4rem_10rem_1fr] sm:items-start sm:gap-8"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-border transition-colors group-hover:border-cyan group-hover:bg-ink group-hover:text-background">
              <Award className="h-4 w-4" strokeWidth={1.4} />
            </span>
            <span className="label pt-2 text-cyan">{a.period ?? "—"}</span>
            <div>
              <h3 className="display-thin text-xl">{a.title}</h3>
              {a.org && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{a.org}</p>}
              {a.detail && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{a.detail}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
