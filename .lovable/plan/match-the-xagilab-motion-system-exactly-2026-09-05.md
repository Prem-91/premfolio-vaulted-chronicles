# Match the xagilab motion system exactly

Goal: every effect in the reference recording, applied across the whole site. No new visual ideas — only the behaviours visible in the video.

## Effects to replicate (from the recording)

1. **Intro loader** — near-white blueprint canvas, letters of the name appearing one by one, widely spaced and thin, then the whole loader lifting away to reveal the page.
2. **Blueprint grid that draws itself** — faint square grid over the full page, with a few individual cells outlining themselves as you scroll, plus the small crosshair marks at intersections.
3. **Right-edge scroll indicator** — the progress marker sits as a short vertical bar on the right edge (moving with scroll), not the current thin line across the top.
4. **Per-word heading reveal** — big thin uppercase headings appear word by word, sliding up from behind an invisible mask (already built into the shared heading component; extend to every heading that still misses it).
5. **Character-by-character text with a highlight block** — the reference types small lines out letter by letter and one phrase gets a solid dark highlight block behind it. Apply to the hero identity line and the intro line of each section.
6. **Hairlines that draw left to right** — every section divider grows from the left as it enters view (already present; will be applied to remaining dividers, including inside cards).
7. **Staggered content wipe** — cards, rows, tags and list items reveal in sequence with a clipped upward wipe as each block enters view.
8. **Sticky top bar** — thin uppercase monospace labels with a hairline underneath, a small square logo mark at the left and a boxed action at the right.
9. **Inertial scrolling** — the weighted, slightly delayed scroll feel of the reference, on the whole page.
10. **Left/right paged blocks** — the reference moves through content with small square arrow buttons; the featured work and beyond-the-code sections get the same paged behaviour with a sliding transition.

## Where each is applied

- Shell: loader, grid drawing, right-edge scroll indicator, inertial scroll, crosshair marks.
- Hero: loader hand-off, per-letter identity line with the highlight block, per-word name reveal, drawing rules, stats revealing one cell at a time.
- Every section (About, What I Build, Featured Builds, Currently Building, Experience, Achievements, Beyond the Code, Stack, Writing, Contact): heading word reveal, typed intro line, drawn dividers, staggered children.
- Remaining old-style reveals still using the previous animation library — Stack, Contact form, Featured Builds, Beyond the Code, case study panel — converted to the same shared reveal so timing is identical everywhere.
- Dashboard: same reveal and hairline treatment on its panels and form fields so it feels like one site.

## Technical notes

- One shared motion layer in `src/components/Section.tsx` (`Reveal`, `MaskText`, `DrawRule`, `Card`) plus two new primitives: `TypeLine` (character reveal + highlight block) and `Loader`. Everything else consumes them, so timing/easing is defined once (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Replace the leftover `framer-motion` `whileInView` usages (`Skills.tsx`, `Contact.tsx`, `Projects.tsx`, `Moments.tsx`, `CaseStudyModal.tsx`) with `Reveal`; keep framer-motion only for the lightbox/modal presence transitions.
- `ScrollProgress.tsx` becomes the right-edge marker; grid cell drawing added as CSS keyframes in `src/styles.css`.
- Content, data, schema and dashboard logic stay untouched — presentation only.
- Finish with a build check and a scroll-through capture at mobile (393px) and desktop widths to confirm every section reveals.
