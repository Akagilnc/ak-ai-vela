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
 * Reads "the current calendar month" in Asia/Shanghai. Hardcoded TZ rather
 * than reading server local time — Vercel/Cloudflare/etc default to UTC,
 * and a UTC-served reader on April 30 23:00 Shanghai (= April 30 15:00 UTC)
 * would correctly see April, but May 1 01:00 Shanghai (= April 30 17:00 UTC)
 * would still see April. The 8-hour window each month boundary is exactly
 * the case the seed user (Kailing in Shanghai) hits when she opens /path
 * late at night on the 30th/31st. Flagged by Gemini PR #31 review.
 *
 * `Intl.DateTimeFormat` is the only stdlib API that lets us extract a
 * specific TZ's calendar month without pulling in `date-fns-tz` etc.
 */
function currentMonthShanghai(): number {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    month: "numeric",
  }).format(new Date());
  return parseInt(formatted, 10);
}

/**
 * Resolves which calendar month to display.
 *
 * @param rawParam        Raw `month` query-string value, or undefined if absent.
 * @param availableMonths Month numbers that have DB data (order not required).
 * @param currentMonth    The current calendar month (1-12). Defaults to
 *                        today in Asia/Shanghai. Injected as a param so
 *                        tests are deterministic.
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
  currentMonth: number = currentMonthShanghai(),
): number | null {
  if (availableMonths.length === 0) return null;

  if (rawParam === undefined) {
    // Default routing — three-tier fallback so /path always lands on the
    // most temporally relevant seeded month:
    //   1. current month if seeded (the obvious case);
    //   2. else the *nearest upcoming* seeded month (so April with [5,6]
    //      lands on May, not June — fixes Codex Slice 2 R3 P2);
    //   3. else the most recent past seeded month (Math.max as a final
    //      fallback when there's nothing upcoming, e.g. August with [5,6]).
    if (availableMonths.includes(currentMonth)) return currentMonth;
    const upcoming = availableMonths.filter((m) => m > currentMonth);
    if (upcoming.length > 0) return Math.min(...upcoming);
    // Math.max not array[last]: caller may pass an unsorted array (Prisma
    // orderBy is advisory, not a contract between modules).
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
