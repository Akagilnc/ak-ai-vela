# HANDOFF → Codex: full fix loop for the Path "atomic card + curated view" build

You are taking over an in-flight build that **failed its ship-pre cross-model review**. Do NOT trust any prior "DONE / verbatim verified" claim — they were wrong. Your job: fix every finding below, run the mandated review flow to convergence, then stop and hand back for human review. Do not ship, do not merge, do not commit to main.

## 0. Environment (do not change)

- Repo: `/Users/akagilnc/WorkSpace/ak-ai-vela`. Stack: Next.js 16 App Router, Prisma + sqlite (`better-sqlite3`), vitest, npm.
- Dev server runs on `:3300` (a public cloudflared tunnel `vela.akbot.top` depends on it). **Do NOT restart/kill it.**
- `better-sqlite3` was rebuilt for Node v26 — **do NOT rebuild/reinstall/touch it**.
- DB applied via `npx prisma db push` (NO `prisma/migrations/` dir — schema-push workflow). `prisma/dev.db` has REAL data. Additive only.
- Nothing is committed. The user invokes `/gstack-ship` explicitly — you do NOT ship/PR/commit-to-main.

## 1. The build (what exists)

New, coexisting with the untouched old `/path`+old model:
- Models in `prisma/schema.prisma`: `PathAtom`, `PathCuratedView`, `PathCuratedViewAtom` (+ back-relations on `PathStage`).
- Data: `docs/research/data/g1-may-atoms.ts` (hand-ported; DERIVED from the MD — see §2).
- Seed: `prisma/seed.ts` (`seedPathAtomExplorer()` added; old `seedPathExplorer()` untouched).
- Selector: `src/lib/path/curated-slot.ts` (`selectSlot`).
- Route: `src/app/path/seg/[slug]/page.tsx` (+ `loading.tsx` `error.tsx` `not-found.tsx`).
- Component: `src/components/path/path-curated-view.tsx`.
- Tests: `src/__tests__/{curated-slot,path-atom-schema-shape,path-atoms-seed-shape,path-runtime-db,path-curated-view-render,path-curated-route-hardening}.test.*`.

## 2. Source of truth + the hard line

- `docs/research/path-explorer-sample-g1-may.md` is the **CONTENT BASIS** (parent-facing prose). `g1-may-atoms.ts` is a derived hand-port. Edit prose in the MD's intent; the seed must reproduce the MD's parent-facing content **byte-VERBATIM**.
- The MD has 5 segments (`g1-may-baseline / g1-may-labor-holiday / g1-may-lixia-solar-term / g1-may-dongtan-migration-tail / g1-may-neighborhood-ecology`). Each segment = `### 一、策展视图` (authored prose: leadLine 一句话 / whySpecial 为什么特别 / heart 心法 / output 产出 / serendipity) **plus rich narrative prose** (museum 90-min routes, 东滩 5-species bird-ID table + 6-step plan + Backup plan + 避坑, 家门口 5-species table + how-to + 避坑 + Sources, museum trivia/age-adjustment).
- **HARD LINE: presentation must not regress.** Atom `body` AND curated-view prose must be the MD's parent-facing text verbatim. The MD's `> 标签` lines, the `### 二、原子卡清单` table cells (role/内容 columns), and `> 样板自检` blocks are **internal authoring annotations — NOT parent content**. They must NEVER appear in any atom `body` or rendered output.
- Atom tag enums (single-valued per atom): `gradeFrom/gradeTo` Int 1..12; `interests` Json `string[]` (MULTI-value, derive from the MD 标签: 自然/文化/手作/跨兴趣底盘/etc — not all `["nature"]`); `scheduleKind` `"ALWAYS_ON"|"WINDOW"`; `windowType` `"SOLAR_TERM"|"HOLIDAY"|"SEASON_WINDOW"|null`; `cadenceRole` `"ONE_SHOT"|"LIGHT_RECURRING"|"ANNUAL_RITUAL"`; `frictionLevel` Int 0..3; `setting` `"OUTDOOR"|"INDOOR"|"EITHER"`.
- Negative-feedback submission mechanism is DEFERRED — keep it GENUINELY ABSENT (no param/stub/fake). System runs the inclusive default.

## 3. Punch list (fix ALL)

### P0 — ship-blockers (verbatim/content; the hard line)
1. **atom-body-fidelity** — `g1-may-atoms.ts` atom `body` for the table/plan-heavy atoms dropped the MD's rich parent prose. Confirmed: 东滩 5 bird names appear 0× in atoms vs 5× in MD; 家门口 species 1× vs 7×. Re-port EACH atom `body` verbatim from its corresponding MD narrative section: museum 90-min routes + 按龄调档 + trivia; 东滩 5-species ID table + 6-step plan + photo guidance + 避坑 + Backup plan; 家门口 5-species table + how-to + 避坑 + Sources. Nothing summarized/paraphrased/truncated.
2. **internal-notes-leaked** — `g1-may-atoms.ts:359/377/391/405/419` bodies are MD `原子卡清单` table cells ("兴趣对得上才进贴身；否则不推", "失败友好 backup；…"). These are internal curation annotations, not parent content. Replace every such body with the real parent-facing prose from the MD narrative (e.g. the 东滩 backup atoms get the MD's actual Backup-plan descriptions of 东平/辰山/世纪公园/佘山).

### P1 — must-fix
3. **no-signal-ordering** — `src/lib/path/curated-slot.ts:~63`: `explore[]` is re-sorted by `frictionLevel` then `displayOrder`. This violates the locked rule: when `childProfile` is absent / `interests` empty (no-signal default), ordering must be **displayOrder only** for BOTH tight and explore. Fix: no-signal explore preserves displayOrder order (no friction re-sort). Stay deterministic (no Math.random/Date). Extend `curated-slot.test.ts`: red→green test asserting no-signal explore == displayOrder order; add the missing boundary tests (0 eligible, all atoms friction-filtered, `tightRatio` flooring to 0 → explore-seat clamp).
4. **reset-fk-crash** — `prisma/seed.ts` `resetAll()` deletes `pathStage` before child tables; `PathAtom.stage`/`PathCuratedView.stage` have no `onDelete` → P2003 on `--reset` after atoms seeded. Fix delete order (join → curatedView → atom → … → stage) or add additive `onDelete` cascade (db push). No reset of real data outside the documented `--reset` path; if any data-loss prompt, STOP+report.
5. **reset-no-atom-reseed** — `resetAll()` only calls `seedPathExplorer()`, never the atom seeder → `/path/seg/*` all 404 after `--reset`. Make `resetAll()` reseed atoms too.
6. **bad-slug-200** — `src/app/path/seg/[slug]/page.tsx`: a non-existent slug returns HTTP 200 (must be 404). Prior in-code comment claimed prod returns 404; reproduced 200. Investigate notFound() status behavior in this Next 16 setup; implement so an unknown slug yields a real HTTP 404 while DB-seeded dynamic slugs still resolve without rebuild. Add a test asserting route/status-level 404 (not just rendering `<NotFound/>`).
7. **whyspecial-mislabel** — baseline & labor curated views' `whySpecial` holds the MD's 时间占用/时间预算 text (those MD segments have NO 为什么特别). Component renders `whySpecial` under fixed heading "为什么特别" → parent sees time-budget text mislabeled. Fix the data→field mapping (and/or component) so every prose block shows under its TRUE MD label, and absent/null blocks render nothing.
8. **atom-whitespace** — `src/components/path/path-curated-view.tsx`: atom `body` renders in `<p>` without `white-space: pre-wrap`; multiline bodies collapse. Render multiline atom bodies with line breaks preserved (verbatim display).
9. **empty-prose-sections** — `PROSE_BLOCKS` renders an empty `<section>`/heading when a field is null. Skip blocks whose value is null/empty.
10. **interests-hardcoded** — all atoms `interests=["nature"]`; MD tags some atoms 文化 / 自然+手作 / 跨兴趣底盘. Re-derive each atom's `interests` (multi-value) from its MD 标签. Don't over-constrain the seed-row type to `["nature"]`.

### P2 — do them (cheap) or defer with the wiki defer-protocol
- Seed view-atom join: prune stale links, not upsert-only.
- `curated-slot.test.ts` fixture `cadenceRole:"BASELINE"` is not in the enum — use a valid value.
- `path-curated-route-hardening.test.tsx` tests real route/status, not `<NotFound/>` rendered directly.
- `path-curated-view-render.test.tsx` asserts against the locked selection rules, not `selectSlot()` as its own oracle.

## 4. Procedure you MUST follow (this is what was skipped before)

Follow the project wiki: `~/WorkSpace/vault/ak-cc-wiki/wiki/concepts/tdd-autonomous-dev.md` (spine) + `~/WorkSpace/vault/ak-cc-wiki/wiki/concepts/cross-model-review.md` (the SINGLE source for review setup/invocation/termination). Concretely:

1. Slice the fixes into independently revertable slices. Per slice: **TDD red → green → refactor → branch coverage → narrow self-check → baseline commit** (stage only intended files, never `git add -A`/`.`).
2. After fixes: **ship-pre cross-model review** on the cumulative diff vs main. `N+1+1` (N codex by diff size per the wiki N table + 1 Claude + 1 Gemini), **all reviewers launched in a single parallel batch**. Fix loop until **full concur** (3/3 or (N+2)/(N+2), no P0/P1).
3. **Verbatim fidelity is checked programmatically** (diff atom bodies / prose vs the MD), not by eyeball.
4. If a reviewer/CLI fails (retry-exhausted / rate / broken tooling / hang >3min): judge it FAILED, **flag「本轮缺 X」in the report + degrade per the降级链**. NEVER rationalize a failed reviewer as "self-healed / in attendance". NEVER silent-degrade.
5. Termination: positive = full concur, zero P0/P1. Drift triple (count not shrinking / new finding class / target drift) → STOP + reground, do not rationalize "one more round".
6. **Do NOT declare DONE/verified/ship-ready until the cross-model review actually converges.** Report deviations the moment they happen, not after.

External-CLI conventions: `cat <<'P' | codex exec --model gpt-5.5 - 2>&1` (stdin pipe, NO `-C`, NO positional `$(cat)`); `cat <<'P' | gemini --approval-mode auto_edit 2>&1` (NOT `--approval-mode plan`); always `2>&1`; hang>3min→`pkill`; rate/quota/limit→stop+flag, no retry.

## 5. Do NOT touch

Old `/path` route + old `PathStage`/`PathActivity` model + old `docs/research/data/g1-may-seed.ts` data; `src/app/trait-quiz/*` (pre-existing unrelated lint errors — out of scope); `better-sqlite3`; the dev server on `:3300`. No commit to main, no PR, no `/gstack-ship`.

## 6. Definition of done (then STOP and hand back)

All P0+P1 fixed; P2 fixed or deferred-with-protocol; per-fix TDD evidence; full `npm test` green; `npx tsc --noEmit` exit 0; `npx eslint <changed build files>` clean; `/path` 200, all 5 `/path/seg/<slug>` 200, unknown slug real 404; atom-body & prose verbatim vs MD confirmed programmatically; **ship-pre cross-model review converged (full concur, zero P0/P1; Gemini included or its absence explicitly flagged per降级链)**. Write a completion report to `handoff-codex-report.md` (what was fixed, TDD/verify evidence, final review concur tally, anything deferred-with-protocol, any vendor flagged missing). Do NOT ship/commit-to-main. Hand back for human (Claude main session) review.
