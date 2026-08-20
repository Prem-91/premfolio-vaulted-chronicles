# Finish the portfolio update + fix the dashboard error

## 1. Fix the admin dashboard error (first)

Confirmed cause: the database's `is_admin()` check — used by every write rule on projects, experiences, skills, achievements and about — is currently only runnable by internal service roles, not by your signed-in account. So when the dashboard saves as you, the database rejects it ("permission denied for function is_admin"), which is the error you see on every add/edit.

Fix: allow signed-in users to run `is_admin()` again (it stays a safe check — it only returns true for the one allowlisted email, which is already set correctly). Your dashboard already double-checks admin status server-side before any write, so nothing gets looser.

Then re-test add/edit/delete on each tab.

## 2. Remaining front-end work

**Featured Builds (Work)**
- Rename heading to "Featured builds".
- Show Live / GitHub / Case Study buttons only when the link or detail content exists.
- Add a Case Study modal for projects that have Problem / Solution / Features / Challenges / Learning, styled like the existing lightbox (glass panel, cyan accents, Framer Motion).
- Show a status chip (shipped / building / concept).

**New sections (same visual language as existing ones)**
- What I Build — four cards: AI Applications, Full-Stack Systems, Cloud & Developer Tools, Real-World Technology.
- Currently Building — RoadFix AI (pulled from projects with status `building`).
- Achievements & Recognition — timeline-style list from the achievements table (already seeded with 4 entries).
- Writing — "Coming soon" placeholder card grid.

**Existing section updates**
- Experience section heading → "Experience & education".
- Moments → "Beyond the code", with category and location chips on hex tiles and in the lightbox.

**Navigation**
- Nav links and bottom dock reordered to: Home, About, Work, Experience, Achievements, Beyond the Code, Stack, Writing, Contact.
- Bottom dock gets icons for the two new entries and stays scrollable on mobile.

**SEO & accessibility**
- Page title/description refresh, og/twitter tags, Person JSON-LD in the home route head.
- `public/robots.txt` and `public/sitemap.xml`.
- Alt text and aria-labels audit on new interactive elements.

## 3. Verification
- Build passes.
- Home page renders all sections at 393px and desktop widths (screenshot check).
- Dashboard: add + edit + delete verified on projects, experiences, skills, achievements, moments, about, resume upload.

## Technical notes
- Migration: `GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;`
- New components under `src/components/sections/`: `WhatIBuild.tsx`, `CurrentlyBuilding.tsx`, `Achievements.tsx`, `Writing.tsx`, plus a `CaseStudyModal.tsx`.
- `src/routes/index.tsx` composes the new sections and gains JSON-LD via `head().scripts`.
- No changes to data fetching — `getPortfolio` already returns achievements and the extended project/moment fields.
