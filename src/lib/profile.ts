// Static fallback used by Hero/Nav only when DB hasn't loaded yet.
export const PROFILE = {
  name: "Prem Shinde",
  initials: "PS",
  tagline: "Full-stack & backend engineer building thoughtful software.",
  location: "Pune, Maharashtra, India",
  email: "shindeprem695@gmail.com",
  github: "https://github.com/Prem-91",
  linkedin: "https://www.linkedin.com/in/premshinde0/",
  resumeUrl: "/prem-shinde-resume.pdf",
} as const;

export type ProjectCategory = "Full-Stack" | "AI" | "Backend" | "Open Source";
export const ALL_CATEGORIES: ProjectCategory[] = ["Full-Stack", "Backend", "AI", "Open Source"];
