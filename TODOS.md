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

## P2 — Do when the prerequisite is met

### [M2] Seed script safety: split db:seed and db:reset
- **What:** Refactor seed.ts so `db:seed` only upserts school data (safe to run anytime), and `db:reset` does the full wipe + reseed (destructive, requires confirmation).
- **Why:** Current `db:seed` runs `deleteMany` on Student and QuestionnaireResult tables. Once M2 introduces real student data, running `db:seed` will silently destroy it.
- **When:** M2 (when student data starts existing).
- **Depends on:** M2

## Deferred from CEO Review

- "What If" simulator — P2, wait for seed user feedback to confirm demand (~50 min when gap engine exists)
- WeChat QR code sharing — blocked by local-only deployment
- Calendar export (.ics) — blocked by incomplete deadline data
- Define failure exit criteria — do before seed user conversation
