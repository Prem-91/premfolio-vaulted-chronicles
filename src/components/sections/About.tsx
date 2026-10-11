import type { About as AboutData } from "@/lib/content.functions";
import { siteContent } from "@/lib/site-content";
import { PROFILE } from "@/lib/profile";
import { Section, Reveal } from "@/components/Section";

export function About({ about }: { about: AboutData | null }) {
  const name = about?.name ?? PROFILE.name;
  const initials = about?.initials ?? PROFILE.initials;
  const bio = about?.long_bio ?? "";
  const location = about?.location ?? PROFILE.location;
  const focus = about?.current_focus ?? "Engineering portfolio";
  const github = about?.github_url ?? PROFILE.github;
  const linkedin = about?.linkedin_url ?? PROFILE.linkedin;

  const specs = [
    { k: "Name", v: name },
    { k: "Based in", v: location },
    { k: "Education", v: siteContent(about).education },
    { k: "Currently", v: focus },
  ];

  return (
    <Section
      id="about"
      index="02"
      label="about"
      title="Engineering, close to the ground"
    >
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <Reveal>
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {bio
              .split(/\n{2,}|\n/)
              .filter(Boolean)
              .map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="border-t border-border">
            {specs.map((s) => (
              <div
                key={s.k}
                className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-4 border-b border-border py-4"
              >
                <span className="label">{s.k}</span>
                <span className="min-w-0 text-sm text-foreground">{s.v}</span>
              </div>
            ))}
            <div className="flex flex-wrap gap-6 py-5">
              <a
                href={github}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground underline decoration-border underline-offset-4 transition hover:decoration-foreground"
              >
                GitHub ↗
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground underline decoration-border underline-offset-4 transition hover:decoration-foreground"
              >
                LinkedIn ↗
              </a>
            </div>
            <div className="display-thin border-t border-border pt-6 text-[clamp(3rem,10vw,6rem)] leading-none text-muted-foreground/30">
              {initials}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
