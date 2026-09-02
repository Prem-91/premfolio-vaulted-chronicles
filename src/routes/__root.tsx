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
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 max-w-md text-center">
        <p className="label">404 / signal lost</p>
        <h1 className="display-thin mt-6 text-[clamp(2.5rem,10vw,5rem)]">Off the grid</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          This page has no coordinates. Head back to the index.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center border border-foreground/30 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] transition hover:bg-ink hover:text-background"
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
        <p className="label">error</p>
        <h1 className="display-thin mt-4 text-3xl">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-foreground/25 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em]"
          >
            Go home
          </a>
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
      { name: "theme-color", content: "#fafafa" },
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
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
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
    <html lang="en">
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
