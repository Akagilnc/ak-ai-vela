# TODOS

Deferred work items tracked by engineering and CEO reviews.

## P1 — Must do before or during the relevant milestone

### [M4-POST] html2canvas spike
- **What:** Test html2canvas screenshot with Google Fonts (Fraunces, Plus Jakarta Sans) + Recharts SVG charts on the actual report page.
- **Why:** WeChat sharing is the MVP's core distribution channel. html2canvas + CDN fonts + SVG is the combo most likely to produce rendering artifacts. CEO review flagged html2canvas silent failure as a gap. Codex independently flagged the same risk.
- **When:** Immediately after M4 (interactive report) is complete.
- **Fallback:** If html2canvas fails, evaluate: browser print CSS, Puppeteer server-side screenshot, or manual screenshot instruction.
- **Depends on:** M4 (report UI must exist to test against)

### [M1] Add target range fields to School schema
- **What:** Add SAT 25th/75th percentile, GPA range, prerequisite requirements, and other target range fields to the School model.
- **Why:** `GapResult` type defines `target: { min, max }`, but current schema only has `medianSAT`. M3 gap engine needs range data to compute meaningful gaps. Codex: "schema doesn't support the story you want to tell."
- **When:** During M1 (school data layer + browse UI), when entering complete data for 10-15 schools.
- **Depends on:** M1

### [M1] Use `next/link` for internal navigation
- **What:** Replace `<a href>` tags with Next.js `<Link>` component in `src/app/page.tsx` and future pages.
- **Why:** Plain `<a>` tags trigger full page reloads, bypassing App Router client-side navigation and prefetching.
- **When:** M1, when building real page routes.
- **Depends on:** M1

### [M1] Use Prisma `Json` type for JSON string fields
- **What:** Change `programs`, `applicationDeadline`, `internationalScholarships`, `targetSchools`, `answers` from `String` to `Json` in Prisma schema.
- **Why:** Prisma `Json` type handles serialization automatically and provides better type safety. Currently using `JSON.stringify()` manually in seed/app code.
- **When:** M1, when expanding School schema with target range fields.
- **Depends on:** M1

## P2 — Do when the prerequisite is met

### [M2] ~~Seed script safety: split db:seed and db:reset~~ DONE
- **Status:** Completed in feat/m0-scaffold (commit a8531c2).
- **What was done:** `db:seed` now upserts schools only, `db:reset` does full wipe + reseed via `--reset` flag.

## Deferred from CEO Review

- "What If" simulator — P2, wait for seed user feedback to confirm demand (~50 min when gap engine exists)
- WeChat QR code sharing — blocked by local-only deployment
- Calendar export (.ics) — blocked by incomplete deadline data
- Define failure exit criteria — do before seed user conversation
