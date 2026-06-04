import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Moments } from "@/components/sections/Moments";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { getPortfolio } from "@/lib/content.functions";

const portfolioQO = queryOptions({
  queryKey: ["portfolio"],
  queryFn: () => getPortfolio(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prem Shinde — Full-Stack & Backend Engineer · Pune" },
      {
        name: "description",
        content:
          "Portfolio of Prem Shinde — Computer Engineering student & full-stack/backend engineer from Pune. React, Node, Python, Cloud, AI.",
      },
      { property: "og:title", content: "Prem Shinde — Portfolio" },
      {
        property: "og:description",
        content:
          "Full-stack & backend engineer building thoughtful software at the intersection of code, cloud and AI.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(portfolioQO),
  component: Index,
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Unable to load the portfolio right now. Please try again later.
      </div>
    );
  },
});

function Index() {
  const { data } = useSuspenseQuery(portfolioQO);
  return (
    <main id="top" className="relative">
      <Toaster theme="dark" position="bottom-right" />
      <Nav about={data.about} />
      <Hero about={data.about} />
      <About about={data.about} />
      <Projects projects={data.projects} />
      <Experience items={data.experiences} />
      <Moments items={data.moments} />
      <Skills groups={data.skills} />
      <Contact about={data.about} />
    </main>
  );
}
