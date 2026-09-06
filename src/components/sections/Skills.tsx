import type { SkillsGroup } from "@/lib/content.functions";
import { Section, Reveal } from "@/components/Section";

export function Skills({ groups }: { groups: SkillsGroup[] }) {
  return (
    <Section
      id="skills"
      index="08"
      label="stack"
      title="Tools of the trade"
      intro="A practical toolkit, organised by the work it supports."
      wide
    >
      <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal
            key={g.id}
            variant="clip"
            duration={1}
            delay={(i % 3) * 0.08}
            className={`border-b border-border p-6 sm:p-8 ${i % 2 ? "sm:border-l" : ""} lg:border-l ${i % 3 === 0 ? "lg:border-l-0" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="label text-cyan">{g.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{String(g.items.length).padStart(2, "0")}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {g.items.map((s, j) => (
                <Reveal
                  key={s}
                  as="span"
                  variant="up"
                  duration={0.6}
                  delay={0.1 + j * 0.03}
                  className="inline-block text-sm text-foreground transition-colors hover:text-cyan"
                >
                  {s}
                </Reveal>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
