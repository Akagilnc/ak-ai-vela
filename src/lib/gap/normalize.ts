// Chinese GPA normalization to the US 4.0 scale.
//
// Source: docs/designs/vela-mvp.md "GPA Normalization" section (CEO plan),
// with sub-80% buckets extended in PR #7 Round 3 per Gemini feedback.
// The midpoint table is deliberately coarse — Chinese percentage GPAs carry
// significant inter-school variance that a linear rescale cannot capture.
// M3 accepts this as a known approximation.
//
// Caller contract: the dimension / actions.ts layer determines WHICH path
// to use based on the student's `gpaType` answer. This function is a pure
// lookup, not a business rule — it does NOT fall back from percentage to
// rank when the percentage input is invalid, because silently switching
// paths would hide a data-quality problem from the caller that explicitly
// selected the percentage path. When both fields happen to be present,
// percentage wins as a tiebreaker; callers that want the rank path must
// pass `gpaPercentage = null`. Returns null when the selected path has
// no usable input.
//
// Sub-80 calibration (PR #7 Round 3, Gemini finding): the original table
// floored anything below 80% at 2.5, which was too optimistic for the
// 40-60% range. In the Chinese secondary-school grading convention 60%
// is the pass line and <60% is failing, so a student at 40% getting a
// 2.5 US-equivalent hid the real gap from pre-vet applicants who need
// 3.0+ across every target. Extended to:
//   70-79 → 2.8   ("good" range in China, solid C+/B- in US)
//   60-69 → 2.3   ("pass" range, US C)
//   < 60  → 1.8   (failing in China, US D+)
// Rank path got the same calibration mirrored onto percentile buckets.
//
// Rank percentile formula tradeoff (PR #7 — revisited in every round):
// Three bot reviewers have flagged this line in opposite directions across
// three rounds, so the tradeoff belongs in the code itself.
//
// The inclusive formula `(total - rank + 1) / total` was chosen in Round 1
// (Codex + Gemini + Copilot all independently flagged the original
// `1 - rank/total`, which mapped `1/1 → 0` and downgraded first-place
// students in small classes to the bottom bucket). Inclusive fixes small
// classes cleanly: `1/1 → 1.0`, `1/10 → 1.0`.
//
// The tradeoff Codex surfaced in Round 3: inclusive shifts boundary cases
// upward by `1/total`. Example: `11/200 → 0.95` lands in the 3.95 bucket
// even though a pure top-5.5% reading would fall in 3.8. The alternatives
// fail in the opposite direction:
//   - Midpoint `(total - rank + 0.5) / total`: `11/200 → 0.9475` (correct)
//     but `1/1 → 0.5` (small-class first-place lands in 3.25, wrong).
//   - Exclusive `1 - rank/total`: `1/1 → 0` (worst bucket, wrong), the
//     original bug.
// No closed-form formula hits both ends. Inclusive was kept because the
// small-class failure is a systematic harm to Chinese first-place students
// (especially common in rural or small-cohort high schools), while the
// large-class boundary drift is bounded by `1/total` — at 200 students
// that's 0.5%, at 2000 it's 0.05%, both well inside bucket boundary noise.
// The midpoint table itself has higher uncertainty than this drift.

export function normalizeChineseGpa(
  gpaPercentage: number | null | undefined,
  classRank: string | null | undefined,
): number | null {
  // Percentage path (selected when gpaPercentage is provided).
  if (gpaPercentage != null) {
    // Guard against NaN, Infinity, and out-of-range inputs. Zod validates the
    // questionnaire form, but `actions.ts` and ad-hoc test fixtures may call
    // this directly, so the guard belongs in the library function itself.
    if (!Number.isFinite(gpaPercentage)) return null;
    if (gpaPercentage < 0 || gpaPercentage > 100) return null;

    if (gpaPercentage >= 95) return 3.95;
    if (gpaPercentage >= 90) return 3.8;
    if (gpaPercentage >= 85) return 3.6;
    if (gpaPercentage >= 80) return 3.25;
    if (gpaPercentage >= 70) return 2.8;
    if (gpaPercentage >= 60) return 2.3;
    return 1.8;
  }

  // classRank path: "rank/total" string → percentile → bucket.
  //
  // Percentile uses the inclusive rank formula `(total - rank + 1) / total`,
  // which maps rank 1 to 1.0 for any class size. The naive `1 - rank/total`
  // formula maps rank 1/1 to 0 (worst bucket) and rank 1/10 to 0.9 (one
  // bucket below top), systematically downgrading first-place students in
  // small classes. The inclusive formula differs from the naive one by at
  // most 1/total, which never crosses a bucket boundary for the large-class
  // cases the CEO plan midpoint table was calibrated against. Flagged by
  // Codex, Gemini, and Copilot independently on PR #7.
  if (classRank) {
    const parsed = parseClassRank(classRank);
    if (parsed == null) return null;
    const percentile = (parsed.total - parsed.rank + 1) / parsed.total;
    if (percentile >= 0.95) return 3.95;
    if (percentile >= 0.9) return 3.8;
    if (percentile >= 0.75) return 3.6;
    if (percentile >= 0.5) return 3.25;
    if (percentile >= 0.3) return 2.8;
    if (percentile >= 0.15) return 2.3;
    return 1.8;
  }

  return null;
}

// Parse "5/200" → {rank: 5, total: 200}. Tolerates surrounding whitespace and
// whitespace around the slash. Returns null for any malformed input,
// inverted rank (rank > total), or zero/negative bounds.
function parseClassRank(rank: string): { rank: number; total: number } | null {
  const match = rank.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) return null;
  const r = Number(match[1]);
  const t = Number(match[2]);
  if (!Number.isFinite(r) || !Number.isFinite(t)) return null;
  if (t <= 0 || r <= 0 || r > t) return null;
  return { rank: r, total: t };
}
