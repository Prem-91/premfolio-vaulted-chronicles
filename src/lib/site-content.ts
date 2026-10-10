import type { About } from "./content.functions";

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
};

export function siteContent(about: About | null) {
  return { ...DEFAULT_SITE_CONTENT, ...about?.site_content } as typeof DEFAULT_SITE_CONTENT;
}