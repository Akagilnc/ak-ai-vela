// Chinese GPA normalization to the US 4.0 scale.
//
// Source: docs/designs/vela-mvp.md "GPA Normalization" section (CEO plan).
// The midpoint table is deliberately coarse — Chinese percentage GPAs carry
// significant inter-school variance that a linear rescale cannot capture.
// M3 accepts this as a known approximation.
//
// Precedence: if `gpaPercentage` is a finite number in [0, 100], use it.
// Otherwise fall back to `classRank`. If neither is usable, return null.

export function normalizeChineseGpa(
  gpaPercentage: number | null | undefined,
  classRank: string | null | undefined,
): number | null {
  // Percentage path (preferred when valid).
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
    return 2.5;
  }

  // classRank fallback: "rank/total" string → percentile → bucket.
  if (classRank) {
    const parsed = parseClassRank(classRank);
    if (parsed == null) return null;
    const percentile = 1 - parsed.rank / parsed.total;
    if (percentile >= 0.95) return 3.95;
    if (percentile >= 0.9) return 3.8;
    if (percentile >= 0.75) return 3.6;
    if (percentile >= 0.5) return 3.25;
    return 2.5;
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
