# Fix the missing content, clean up the site, make Contact work

## The real bug: most content is invisible

Your builds are in the database and do arrive on the page, but they never become
visible. The scroll-reveal effect hides each card with a "wipe" mask, and that
mask makes the browser report the card as not visible — so the reveal never
triggers and the card stays blank forever. This affects Featured Builds, the
in-progress card, parts of the Stack and the Contact form.

Verified in the browser: the four build cards sit in the viewport at full size
with opacity 0, and a fresh visibility check on them reports "not visible" while
the mask is applied.

Fix: rework the reveal so the element being watched is never masked — the mask
and slide move to an inner wrapper. Every section inherits the fix, so all
content reveals as you scroll like the reference site.

## Cleanups you asked for

- Remove the year from the build card labels ("01 / 2026" becomes "01") and drop
  the year line from the case-study panel header. The year field stays in your
  dashboard for your own reference.
- Remove the "Currently building" section entirely: delete the section, drop it
  from the homepage, and drop the "currently building" status option from the
  dashboard project form (existing in-progress builds simply appear in Featured
  Builds). RoadFix AI stays in the work list.
- Remove the line "No contact number — email and professional links are the best
  way to reach me." and rebalance that panel so it doesn't look empty.

## Contact form that actually works

Right now the form only opens your mail app. Replacement:

- New `contact_messages` table with row-level security: anyone can submit,
  only you can read. Submissions go through a server function with validation
  and rate limiting (matching the existing pattern), never straight from the
  browser.
- The form posts, shows a confirmation, and clears — no mail app, no mailto.
- New "Messages" tab in your dashboard listing every submission (name, email,
  message, time) with delete, so nothing is lost.

## Remaining reference-template parity

- Same paged square arrows on Beyond the Code as Featured Builds.
- Dashboard restyled to the blueprint look: hairline borders, square inputs,
  mono uppercase labels, numbered panels — consistent with the homepage.
- SEO finishing: `robots.txt`, `sitemap.xml`, Person structured data, image alt
  text checks.
- Verification pass: full scroll-through at phone and desktop widths confirming
  every section reveals, plus a build check.

## Technical notes

- `src/components/Section.tsx`: `Reveal` observes an unclipped outer element and
  applies `clip-path`/`transform` to an inner span/div; threshold lowered and
  a fallback timer marks content visible if the observer never fires.
- `src/components/sections/Projects.tsx`, `CaseStudyModal.tsx`: drop year output.
- Delete `src/components/sections/CurrentlyBuilding.tsx`; update
  `src/routes/index.tsx` and the admin status select.
- `src/lib/content.functions.ts`: `submitContactMessage` (public, validated,
  rate-limited), `listContactMessages` / `deleteContactMessage` (admin-gated via
  `requireSupabaseAuth`).
- Migration: `contact_messages` with GRANTs (`INSERT` to `anon`/`authenticated`,
  full to `service_role`), RLS enabled, admin-only select/delete via `is_admin()`.
