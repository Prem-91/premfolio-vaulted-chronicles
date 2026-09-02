# Finish the blueprint (Xagilab-style) rebuild

The new design system already exists (`src/styles.css` blueprint tokens, `Section`/`Reveal`/`Card` primitives, crosshair cursor). What's left is applying it everywhere: the page still renders the old dark/rounded/neon components, and the root still loads the old fonts.

## 1. Foundation
- Load Montserrat (200/300/400/500) + JetBrains Mono in the root head, replacing the Syne / DM Sans / Space Mono link (the tokens already reference the new families, so type currently falls back).
- Switch the shell off the `dark` class, set the light theme color, keep the grain overlay and crosshair cursor.
- Restyle the 404 and error screens to the hairline light look (no glow, no rounded buttons).

## 2. Hero
Rebuild as an editorial title block, matching the reference's structure and motion:
- Full-viewport near-white canvas with the blueprint grid, soft drifting wash, and a thin top rule that draws in on load.
- Small numbered/monospace eyebrow, oversized thin uppercase name in staggered line reveals (mask-up per line), then the identity line "AI & Full-Stack Developer · Computer Engineering Student @ SPPU" and the supporting statement.
- Keep the animated tagline typewriter, the metadata chips (location, SPPU, current focus), and the CTAs — restyled as square hairline buttons with one solid ink primary.
- Stats row (3+, 150+, 8.41+, 5+) as four hairline cells divided by rules instead of glass cards.
- Below the hero: a slow monospace marquee ticker of the tech stack, like the reference's scrolling strip.

## 3. Navigation
- Nav: transparent at top, hairline border + white blur once scrolled; monospace uppercase wide-tracked links with an underline that draws on hover; square outline Resume button.
- Reorder both Nav and the bottom dock to: Home, About, Work, Experience, Achievements, Beyond the Code, Stack, Writing, Contact (add icons for Achievements and Writing).
- Dock: hairline white bar with square cells and a thin active indicator rather than the cyan pill.

## 4. Port every section onto `Section` / `Card`
Each gets the numbered label, thin uppercase heading, hairline rules, and `Reveal` staggering:
- **01 About** — two-column: bio text + a hairline spec list (location, education, focus, links).
- **02 What I Build** — four numbered hairline cards, hover inverts to ink.
- **03 Featured builds** — hairline grid, monospace index per project, status chip, conditional Live / GitHub / Case Study buttons; case-study modal restyled as a full-bleed ink panel.
- **04 Currently building** — single wide ink panel for RoadFix AI.
- **05 Experience & education** — hairline timeline with dashed connector and square markers.
- **06 Achievements & recognition** — numbered hairline rows.
- **07 Beyond the code** — keep the scrollable honeycomb, now grayscale → color on hover, with category and location chips in the lightbox.
- **08 Stack** — grouped rows (Languages, Frontend & Backend, Data, Cloud & DevOps, AI & Developer Tools) as hairline tag lists.
- **09 Writing** — "coming soon" hairline rows.
- **10 Contact** — large thin call-to-action, email + social links, existing footer line kept.

## 5. Compose and finish
- Wire all sections (including What I Build, Currently Building, Achievements, Writing) into `src/routes/index.tsx` in the nav order.
- SEO pass: refreshed title/description, Person JSON-LD, `robots.txt`, `sitemap.xml`.
- Verify the build and check mobile (393px) + desktop rendering in the browser.

## Notes
- Content and the admin dashboard stay exactly as they are — this is presentation only, no schema or data changes.
- No new dependencies; motion uses the existing Framer Motion + CSS keyframes already in `styles.css`.
