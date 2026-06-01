export const PROFILE = {
  name: "Prem Shinde",
  initials: "PS",
  tagline: "Full-stack & backend engineer building thoughtful software.",
  longBio:
    "Computer Engineering student at SPPU / TSSM's BSCOER in Pune, India. I build full-stack systems with React, Node and Python — focused on real-time data, sensible architecture, and tools that solve actual problems for actual people.",
  location: "Pune, Maharashtra, India",
  email: "shindeprem695@gmail.com",
  phone: "+91 96992 23361",
  github: "https://github.com/Prem-91",
  githubHandle: "Prem-91",
  linkedin: "https://www.linkedin.com/in/premshinde0/",
  linkedinHandle: "premshinde0",
  resumeUrl: "/prem-shinde-resume.pdf",
} as const;

export const SKILLS = {
  Languages: ["Python", "TypeScript", "JavaScript", "Java", "C", "SQL", "HTML/CSS"],
  Frameworks: ["React", "Next.js", "Node.js", "Flask", "Pandas", "NumPy"],
  "Cloud & DevOps": ["AWS", "Google Cloud", "Supabase", "Cloudinary", "Git", "GitHub"],
  Databases: ["PostgreSQL", "MongoDB", "Supabase"],
  "AI / Tools": ["Gemini AI", "REST APIs", "PWA", "i18next", "Tailwind CSS"],
} as const;

export type ProjectCategory = "Full-Stack" | "AI" | "Backend" | "Open Source";

export const PROJECTS: Array<{
  name: string;
  description: string;
  stack: string[];
  categories: ProjectCategory[];
  github?: string;
  live?: string;
  year: string;
  featured?: boolean;
}> = [
  {
    name: "Sachet",
    description:
      "Real-time disaster response platform connecting victims with NGOs, volunteers and government workers across India. Live GPS reports, helper map, and AI-scored severity.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Supabase", "Gemini AI", "i18next", "PWA"],
    categories: ["Full-Stack", "AI"],
    github: "https://github.com/Prem-91",
    year: "2025",
    featured: true,
  },
  {
    name: "Interview Coach AI",
    description:
      "Ethical AI mock-interview assistant. Detects topic & intent (DSA, OS, DBMS, OOP, System Design) and delivers progressive hints — never the full solution.",
    stack: ["Vite", "React", "TypeScript", "shadcn/ui", "Tailwind", "Gemini AI"],
    categories: ["Full-Stack", "AI"],
    live: "https://interview-ai-ripis.lovable.app",
    github: "https://github.com/Prem-91",
    year: "2025",
    featured: true,
  },
];

export const TIMELINE = [
  {
    kind: "edu" as const,
    title: "B.Tech, Computer Engineering",
    org: "TSSM's BSCOER · Savitribai Phule Pune University",
    period: "Sept 2024 – Dec 2028",
    detail: "GPA 8.68/10 (Sem 1 & 2). Coursework: DSA, DBMS, ML, OOP.",
  },
  {
    kind: "exp" as const,
    title: "Active Member — ACES",
    org: "Association of Computer Engineering Students",
    period: "2024 — Present",
    detail:
      "Organize technical workshops and coding events for 150+ Computer Engineering students.",
  },
  {
    kind: "exp" as const,
    title: "Open Source Contributor",
    org: "GitHub",
    period: "Ongoing",
    detail:
      "Contributing to OSS projects — improving code quality, fixing issues, and writing documentation.",
  },
  {
    kind: "exp" as const,
    title: "Hackathon Builder",
    org: "Multiple events",
    period: "Ongoing",
    detail: "Building rapid prototypes for local community problems.",
  },
];
