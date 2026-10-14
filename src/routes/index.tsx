import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Nav } from "@/components/Nav";
import { BottomDock } from "@/components/BottomDock";
import { ChatWidget } from "@/components/ChatWidget";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { Projects } from "@/components/sections/Projects";

import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { Moments } from "@/components/sections/Moments";
import { Skills } from "@/components/sections/Skills";
import { Writing } from "@/components/sections/Writing";
import { Contact } from "@/components/sections/Contact";
import { SiteContentProvider } from "@/components/Section";
import { siteContent } from "@/lib/site-content";
import { getPortfolio } from "@/lib/content.functions";

const portfolioQO = queryOptions({ queryKey: ["portfolio"], queryFn: () => getPortfolio() });

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prem Shinde",
  jobTitle: "AI & Full-Stack Developer",
  url: "https://premshinde.lovable.app",
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "TSSM's BSCOER, Savitribai Phule Pune University" },
  sameAs: ["https://github.com/Prem-91", "https://www.linkedin.com/in/premshinde0/"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prem Shinde — AI & Full-Stack Developer" },
      { name: "description", content: "Portfolio of Prem Shinde, an AI and full-stack developer building practical digital solutions, cloud systems and thoughtful software." },
      { property: "og:title", content: "Prem Shinde — AI & Full-Stack Developer" },
      { property: "og:description", content: "AI-powered applications, full-stack systems and practical digital solutions by Prem Shinde." },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://premshinde.lovable.app/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(PERSON_JSONLD) }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQO),
  component: Index,
  errorComponent: ({ error }) => { console.error(error); return <div className="p-10 text-center text-sm text-muted-foreground">Unable to load the portfolio right now. Please try again later.</div>; },
});

function Index() {
  const { data } = useSuspenseQuery(portfolioQO);
  return <SiteContentProvider value={siteContent(data.about)}><main id="top" className="relative pb-24"><Toaster theme="light" position="bottom-right" /><Nav about={data.about} /><Hero about={data.about} stats={{ projects: data.projects.length, technologies: new Set(data.skills.flatMap((g) => g.items)).size, roles: data.experiences.length, moments: data.moments.length }} /><About about={data.about} /><WhatIBuild about={data.about} /><Projects projects={data.projects} /><Experience items={data.experiences} /><Achievements items={data.achievements} /><Moments items={data.moments} /><Skills groups={data.skills} /><Writing about={data.about} /><Contact about={data.about} /><BottomDock /><ChatWidget /></main></SiteContentProvider>;
}
