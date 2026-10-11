import type { About } from "./content.functions";
import { z } from "zod";

export const siteContentSchema = z.object({
  hero_identity: z.string().max(500), hero_statement: z.string().max(2000), education: z.string().max(500),
  hero_phrases: z.array(z.string().max(500)).max(20), ticker: z.array(z.string().max(80)).max(40),
  hero_stats: z.array(z.object({ big: z.string().max(40), label: z.string().max(100) })).max(8),
  build_cards: z.array(z.object({ title: z.string().max(200), detail: z.string().max(2000) })).max(20),
  writing_titles: z.array(z.string().max(500)).max(20), contact_note: z.string().max(2000), footer: z.string().max(500),
  section_titles: z.record(z.string().max(300)).optional(),
});
export type SiteContent = z.infer<typeof siteContentSchema>;

export const DEFAULT_SITE_CONTENT = {
  hero_identity: "AI & Full-Stack Developer — Computer Engineering Student @ SPPU",
  hero_statement: "I build AI-powered applications, full-stack systems, and practical digital solutions that solve real-world problems.",
  education: "TSSM's BSCOER · SPPU · Computer Engineering",
  hero_phrases: ["Building AI-powered applications", "Shipping full-stack systems", "Exploring cloud & developer tooling"],
  hero_stats: [
    { big: "3+", label: "featured builds" }, { big: "150+", label: "students reached" },
    { big: "8.41+", label: "academic performance" }, { big: "5+", label: "community experiences" },
  ],
  ticker: ["Python", "TypeScript", "React", "Node.js", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "GitOps", "LLM Apps", "AWS", "Tailwind"],
  build_cards: [
    { title: "AI Applications", detail: "LLM-powered tools, retrieval pipelines and assistive interfaces designed around a concrete user problem rather than a demo." },
    { title: "Full-Stack Systems", detail: "End-to-end products: typed APIs, relational data models, auth, and interfaces that stay fast on a mid-range phone." },
    { title: "Cloud & Developer Tools", detail: "Containers, CI/CD and GitOps workflows — automating the boring parts so shipping stays repeatable and boring too." },
    { title: "Real-World Technology", detail: "Civic and campus-scale software: reporting, safety and sustainability tooling that has to work outside the browser tab." },
  ],
  writing_titles: ["Notes on shipping an AI feature that people actually use", "GitOps for small teams: what I automated first", "Designing a data model before writing any UI"],
  contact_note: "Messages land straight in my inbox. I usually reply within a day or two.",
  footer: "designed & built from scratch · </> with care",
  section_titles: { about: "Engineering, close to the ground", "what-i-build": "Four kinds of work", projects: "Featured builds", experience: "Experience & education", achievements: "Recognition, earned", moments: "Beyond the code", skills: "Tools of the trade", writing: "Notes & write-ups", contact: "Let’s build something." },
};

export function siteContent(about: About | null) {
  const result = siteContentSchema.safeParse({ ...DEFAULT_SITE_CONTENT, ...about?.site_content });
  return result.success ? result.data : DEFAULT_SITE_CONTENT;
}