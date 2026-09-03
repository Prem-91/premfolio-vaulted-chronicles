# Finish the Blueprint (xagilab-style) rebuild — site + dashboard

The new light "blueprint" design system already exists in `src/styles.css` (near-white canvas, hairline borders, zero radius, Montserrat + JetBrains Mono, marquee/reveal animations) along with the shared `Section` / `Card` / `Reveal` primitives and the crosshair cursor. The remaining sections, the hero, nav/dock and the admin dashboard still carry the old dark neon styling. This pass converts everything.

## 1. Global shell

- Load Montserrat + JetBrains Mono via `<link>` in the root route head; drop the `dark` class and dark-theme leftovers.
- Add the fixed blueprint background grid, fine grain overlay and thin frame rails behind all content.
- Remove the starfield/aurora dark-canvas leftovers so the light canvas reads clean.

## 2. Hero

Editorial title block: small meta rail (location · SPPU · current focus), oversized thin uppercase name with masked line-by-line reveal, animated typewriter tagline, the supporting statement, hairline CTA buttons (Resume, GitHub, LinkedIn, Contact), a 4-cell hairline stat grid (3+ featured builds, 150+ students reached, 8.41+ academic performance, 5+ community experiences) and a running stack marquee at the bottom edge.

## 3. Navigation

- Top bar: hairline underline, monospace uppercase links, initials mark on the left, resume link on the right, mobile sheet in the same hairline style.
- Bottom dock: square hairline cells with monospace tooltips, active cell inverted to the dark ink panel. Keeps the 9-item order (Home, About, Work, Experience, Achievements, Beyond the Code, Stack, Writing, Contact).

## 4. Sections ported to the blueprint

Every section moves onto `Section` (numbered `01. LABEL` head, thin uppercase title, hairline rules) and `Card`:

- **About** — two-column editorial text with a hairline fact list.
- **What I Build** — 4 hairline cells, numbered, hover invert.
- **Featured builds** — hairline project rows/grid, monospace stack chips, status chip, conditional Live/GitHub/Case Study actions.
- **Case study modal** — full-bleed light panel, hairline dividers, monospace block labels.
- **Currently building** — wide hairline panel with an animated in-progress marker.
- **Experience & education** — hairline vertical rail timeline with monospace periods.
- **Achievements & recognition** — numbered hairline list rows.
- **Beyond the code** — honeycomb kept, restyled grayscale → color on hover, category/location chips, hairline lightbox.
- **Stack** — grouped hairline columns (Languages, Frontend & Backend, Data, Cloud & DevOps, AI & Developer Tools).
- **Writing** — dashed hairline "coming soon" cells.
- **Contact** — large hairline form + link column, existing footer line kept.

All neon glow, glass, rounded and cyan-heavy utilities are replaced by hairline borders, ink panels and the restrained teal accent. Responsiveness preserved at mobile/tablet/desktop.

## 5. Homepage composition

`src/routes/index.tsx` renders in nav order: Hero, About, What I Build, Featured builds, Currently building, Experience & education, Achievements, Beyond the code, Stack, Writing, Contact + dock.

## 6. Admin dashboard restyle

`/admin` is reskinned to the same language — no behaviour or field changes:

- Hairline tab rail with monospace uppercase labels, active tab as an ink panel.
- Zero-radius inputs/textareas/selects with hairline borders and monospace labels; focus state is a teal hairline.
- Records shown as hairline rows with monospace metadata; edit/delete as icon buttons.
- `+ Add` actions become hairline ink buttons matching the site.
- Project (problem / solution / features / challenges / learning / status), moment (category / location) and achievement fields are grouped into labelled hairline field blocks that mirror how the homepage sections present them.
- Login screen and resume upload panel restyled to match.

## 7. SEO and verification

- Refresh title/meta and per-route head; add Person JSON-LD, `robots.txt`, `sitemap.xml`; alt text on images.
- Build check, then Playwright passes at mobile and desktop widths to confirm layout, animations and the dashboard render correctly.

## Technical notes

Touched files: `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/admin.tsx`, `src/components/Nav.tsx`, `src/components/BottomDock.tsx`, `src/components/CursorTrail.tsx`, all of `src/components/sections/*`, plus small additions to `src/styles.css` and `public/robots.txt` / `public/sitemap.xml`. Data layer (`src/lib/content.functions.ts`) and the database stay unchanged.
