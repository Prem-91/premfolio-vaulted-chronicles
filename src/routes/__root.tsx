import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CursorTrail } from "../components/CursorTrail";
import { SmoothScroll } from "../components/SmoothScroll";
import { ScrollProgress } from "../components/ScrollProgress";
import { Loader } from "../components/Loader";
import { GridCells } from "../components/GridCells";

function NotFoundComponent() { return <div className="grain relative flex min-h-screen items-center justify-center bg-background px-4"><div className="blueprint pointer-events-none absolute inset-0 opacity-60" /><div className="relative z-10 max-w-md text-center"><p className="label">404 / signal lost</p><h1 className="display-thin mt-6 text-[clamp(2.5rem,10vw,5rem)]">Off the grid</h1><p className="mt-6 text-sm text-muted-foreground">This page has no coordinates. Head back to the index.</p><Link to="/" className="mt-8 inline-flex border border-foreground/30 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] transition hover:bg-ink hover:text-background">← return home</Link></div></div>; }
function ErrorComponent({ error, reset }: ErrorComponentProps) { console.error(error); const router = useRouter(); useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]); return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><p className="label">error</p><h1 className="display-thin mt-4 text-3xl">Something went wrong</h1><p className="mt-3 text-sm text-muted-foreground">Please try again.</p><div className="mt-8 flex justify-center gap-2"><button onClick={() => { router.invalidate(); reset(); }} className="bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-background">Try again</button><a href="/" className="border border-foreground/25 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.28em]">Go home</a></div></div></div>; }

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "theme-color", content: "#fafafa" }, { title: "Prem Shinde — AI & Full-Stack Developer" }, { name: "description", content: "Prem Shinde — AI and full-stack developer building practical digital solutions." }, { name: "author", content: "Prem Shinde" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" }] }),
  shellComponent: RootShell, component: RootComponent, notFoundComponent: NotFoundComponent, errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><div className="grain"><div className="blueprint pointer-events-none fixed inset-0 z-[-1] opacity-40" /><GridCells /><div className="pointer-events-none fixed inset-y-0 left-3 z-30 hidden w-px bg-border sm:block" /><div className="pointer-events-none fixed inset-y-0 right-3 z-30 hidden w-px bg-border sm:block" /><Loader /><CursorTrail /><SmoothScroll /><ScrollProgress /><Outlet /></div></QueryClientProvider>; }
