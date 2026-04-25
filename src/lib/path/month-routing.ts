/**
 * Month-routing utilities for Path Explorer.
 *
 * resolveMonth  — maps a raw ?month= query param + DB-available months to a
 *                 single calendar month number (or null for invalid/no-data).
 * monthSeason   — returns a short Chinese season label for display.
 * pillRange     — computes the visible month pill range for the overview header.
 *
 * All three are pure functions so they can be unit-tested without Next.js or DB.
 */

// ─────────────────────────────────────────────────────────────────────────────
// resolveMonth
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves which calendar month to display.
 *
 * @param rawParam        Raw `month` query-string value, or undefined if absent.
 * @param availableMonths Month numbers that have DB data (order not required).
 * @param currentMonth    The current calendar month (1-12). Defaults to today.
 *                        Injected as a param so tests are deterministic.
 *
 * @returns The resolved month (1-12), or null in two cases:
 *   - Explicit param: the value is invalid or has no data in DB.
 *   - No param:       availableMonths is empty.
 *
 * Callers should treat null + explicit param as a 404 signal, and null + no
 * param as an empty-state signal (DB not yet seeded for any month).
 */
export function resolveMonth(
  rawParam: string | undefined,
  availableMonths: number[],
  currentMonth: number = new Date().getMonth() + 1,
): number | null {
  if (availableMonths.length === 0) return null;

  if (rawParam === undefined) {
    // Default: current calendar month if it has data, else most recent.
    if (availableMonths.includes(currentMonth)) return currentMonth;
    // Use Math.max rather than last element: caller may pass an unsorted array
    // (Prisma orderBy is advisory, not a contract between modules).
    return Math.max(...availableMonths);
  }

  // Only accept pure integer strings: "5", "12", etc.
  // Reject "5.5", "6.0", " 5", "abc", "".
  if (!/^\d{1,2}$/.test(rawParam)) return null;

  const n = parseInt(rawParam, 10);
  if (n < 1 || n > 12) return null;
  if (!availableMonths.includes(n)) return null;

  return n;
}

// ─────────────────────────────────────────────────────────────────────────────
// monthSeason
// ─────────────────────────────────────────────────────────────────────────────

const SEASON_LABELS: Record<number, string> = {
  1: "寒冬",
  2: "早春",
  3: "春意渐浓",
  4: "仲春",
  5: "春末夏初",
  6: "初夏",
  7: "盛夏",
  8: "末夏",
  9: "初秋",
  10: "金秋",
  11: "深秋",
  12: "初冬",
};

/**
 * Returns a short Chinese season description for the given month (1-12).
 * Falls back to "N 月" for out-of-range inputs so the UI never crashes.
 */
export function monthSeason(month: number): string {
  return SEASON_LABELS[month] ?? `${month} 月`;
}

// ─────────────────────────────────────────────────────────────────────────────
// pillRange
// ─────────────────────────────────────────────────────────────────────────────

const PILL_BUFFER = 2; // ghost months to show on each side of available range
const MIN_PILLS = 4;   // minimum visible pills to keep the row from looking empty

/**
 * Computes the sorted list of month numbers to render in the pill row.
 *
 * The range spans from (min(available) - PILL_BUFFER) to
 * (max(available) + PILL_BUFFER), clamped to [1, 12]. If the resulting range
 * is shorter than MIN_PILLS, it is extended rightward (then leftward) until
 * the minimum is reached.
 *
 * Returns [] for empty input so callers can skip rendering the pill row.
 */
export function pillRange(availableMonths: number[]): number[] {
  if (availableMonths.length === 0) return [];

  const lo = Math.min(...availableMonths);
  const hi = Math.max(...availableMonths);

  let start = Math.max(1, lo - PILL_BUFFER);
  let end = Math.min(12, hi + PILL_BUFFER);

  // Extend to meet minimum pill count
  while (end - start + 1 < MIN_PILLS) {
    if (end < 12) end++;
    else if (start > 1) start--;
    else break; // capped at both ends
  }

  const range: number[] = [];
  for (let m = start; m <= end; m++) range.push(m);
  return range;
}
