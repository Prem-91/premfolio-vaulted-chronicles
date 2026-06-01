import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

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
        content: "Full-stack & backend engineer building thoughtful software at the intersection of code, cloud and AI.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main id="top" className="relative">
      <Toaster theme="dark" position="bottom-right" />
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
