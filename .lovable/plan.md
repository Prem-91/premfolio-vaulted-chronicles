## Overview

Personal portfolio site for **Prem Shinde** (Computer Engineering student, Pune) built on the project's existing **TanStack Start + React + Tailwind v4** stack (not plain Vite + React Router — the router/SSR scaffolding is already in place; I'll adapt the brief to it). Dark, editorial, "hacker meets digital artist" aesthetic with a hidden `/vault` route for private memories backed by Lovable Cloud.

## Pages & routes

```
/                    Hero + About + Projects + Experience + Skills + Contact (single scrolling page)
/vault               PIN gate → memories gallery (hidden, not in nav)
/__root 404          "Lost in the void" not-found
```

One-page layout for the main portfolio (matches the cinematic scroll-driven feel); vault lives on its own route.

## Design system

- **Background:** obsidian `oklch(0.13 0.01 250)` with subtle SVG noise/grain overlay
- **Accent:** electric cyan/teal `oklch(0.82 0.15 195)`
- **Type:** Syne (display) + DM Sans (body), loaded via Google Fonts
- **Cards:** glassmorphism (backdrop-blur + 1px hairline border)
- **Motion:** Framer Motion — staggered scroll reveals, hero typewriter, custom cursor trail, parallax on hero
- All tokens defined in `src/styles.css` (oklch); components use semantic classes only

## Sections (single page)

1. **Hero** — full-viewport, animated particle/grid canvas, name in Syne, typewriter tagline, CTAs ("View Work", "Download Resume"), scroll indicator
2. **About** — split layout, portrait placeholder + bio pulled from CV, location chip "Pune, India 🇮🇳", current focus line
3. **Projects** — bento grid with filter tabs (All / Full-Stack / AI / Open Source). Seeded from CV: **Sachet** (Next.js, Supabase, Gemini AI, PWA) and **Interview Coach AI** (Vite, React, shadcn). Each card: name, description, tech pills, GitHub + live links
4. **Experience & Education** — vertical animated timeline. Education: TSSM's BSCOER / SPPU, B.Tech Computer Engineering, Sept 2024 – Dec 2028, GPA 8.68. Leadership: ACES active member, hackathons, OSS contributor
5. **Skills** — grouped tag cloud: Languages (Python, C, JavaScript, Java, SQL), Frameworks (React, Node, Flask, Pandas, NumPy), Cloud/Tools (AWS, GCP, Supabase, Cloudinary, MongoDB, Git), Practices (PWA, Code Review)
6. **Contact** — dark form (name/email/message) + social links (GitHub `Prem-91`, LinkedIn `premshinde0`, email `shindeprem695@gmail.com`, phone)

## Vault (hidden `/vault`)

- PIN gate (4–6 digits), single-user
- After auth: masonry gallery with lightbox, upload (drag-drop), per-memory title/date/caption, delete
- Storage in Lovable Cloud (Supabase): `vault-memories` storage bucket + `memories` table (id, title, event_date, caption, image_path, created_at)
- Auth approach: PIN stored as a server-only secret (`VAULT_PIN`); a `createServerFn` validates the PIN and issues a short-lived signed token kept in `sessionStorage`. All upload/list/delete server fns require that token. No public registration.
- Not linked from main nav; direct URL access only

## Tech choices (adapted to this project)

- **TanStack Start** (already scaffolded) instead of plain React Router — same UX, better SSR/SEO
- **Tailwind v4** + shadcn (already installed)
- **Framer Motion** — `bun add framer-motion`
- **react-dropzone** — `bun add react-dropzone`
- **Lucide** — already available
- **Lovable Cloud** — enabled for vault storage + PIN validation
- **EmailJS** — contact form (requires you to provide `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`); until then the form will show a "configure EmailJS" notice and fall back to `mailto:`

## SEO & polish

- Per-route `head()` meta (title, description, OG tags) populated from CV data
- OG image generated (1200x630) with name + tagline
- 404 route: "Lost in the void" — animated drifting glyph
- Loading screen: animated "PS" monogram on first visit
- Resume PDF: uploaded resume copied to `public/prem-shinde-resume.pdf` for the download CTA

## Assumptions / open items (will use sensible defaults unless you say otherwise)

1. **Vault PIN** — I'll default to `prem-shinde-vault` placeholder and prompt you to set the real `VAULT_PIN` secret after Cloud is enabled.
2. **GitHub projects** — I'll seed only the two projects from the CV. Pinned-repo auto-fetch from GitHub API can be added later if you want.
3. **Twitter** — not in CV/brief contacts; omitting unless you provide a handle.
4. **LinkedIn scraping** — LinkedIn blocks unauthenticated scraping. Bio/tagline will be derived from the CV summary. If you paste your LinkedIn "About" text, I'll wire it in verbatim.
5. **Editorial photo** — using a stylized monogram placeholder until you upload a portrait.

## Build order

1. Enable Lovable Cloud (vault needs DB + storage)
2. Add fonts, design tokens, grain overlay, cursor trail primitives
3. Build single-page sections (Hero → About → Projects → Experience → Skills → Contact)
4. Vault: schema + storage bucket + PIN server fn + gallery/upload UI
5. 404, loading screen, SEO meta, OG image, resume asset
6. Mobile QA pass
