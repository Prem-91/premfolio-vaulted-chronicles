import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CursorTrail } from "../components/CursorTrail";

function NotFoundComponent() {
  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="relative z-10 max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">404 / signal lost</p>
        <h1 className="mt-6 font-display text-7xl font-bold text-glow">
          Lost in <span className="text-cyan">the void</span>
        </h1>
        <p className="mt-6 text-sm text-muted-foreground">
          The page drifted off the grid. No coordinates left to follow.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-md border border-cyan/40 bg-cyan/10 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-cyan transition hover:bg-cyan/20 hover:glow-cyan"
        >
          ← return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">Something glitched</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-cyan px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-border px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0d12" },
      { title: "Prem Shinde — Full-Stack & Backend Engineer" },
      {
        name: "description",
        content:
          "Prem Shinde — Computer Engineering student & full-stack/backend engineer from Pune, India. React, Node, Python, Cloud, AI.",
      },
      { name: "author", content: "Prem Shinde" },
      { property: "og:title", content: "Prem Shinde — Full-Stack & Backend Engineer" },
      {
        property: "og:description",
        content: "Portfolio of Prem Shinde. Building thoughtful software at the intersection of code, cloud and AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grain">
        <CursorTrail />
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
