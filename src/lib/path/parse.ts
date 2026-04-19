/**
 * Runtime shape guards for PathActivity Json fields.
 *
 * Prisma typed `previews`, `chips`, and `sections` as `Json`, which at the
 * TypeScript boundary is `unknown`. Today the only writer is the trusted seed
 * file, but any future admin UI / importer / LLM output that lands malformed
 * JSON would otherwise crash React with a runtime type error during SSR.
 *
 * These helpers fail safe: malformed input returns `[]` so the page renders
 * a degraded-but-alive view instead of a 500. Strictness tradeoff: we rely
 * on TypeScript casting for field-level shape (e.g. `{cls, t}` inside chips)
 * — the guard only ensures an array shell, not that every element is sound.
 * Upgrade to full Zod parsing in v0.5+ when untrusted writers arrive.
 */

type TileChip = { cls: string; t: string };

export function parseChips(value: unknown): TileChip[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (c): c is TileChip =>
      typeof c === "object" &&
      c !== null &&
      typeof (c as Record<string, unknown>).cls === "string" &&
      typeof (c as Record<string, unknown>).t === "string",
  );
}

export function parsePreviews(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((p): p is string => typeof p === "string");
}

/**
 * Section array guard. We don't deep-validate each block here (that would
 * duplicate BlockRenderer's switch) — just ensure the outer shape is an
 * array and each element has a `target` string + `blocks` array.
 */
export function parseSections<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (s): s is T =>
      typeof s === "object" &&
      s !== null &&
      typeof (s as Record<string, unknown>).target === "string" &&
      Array.isArray((s as Record<string, unknown>).blocks),
  );
}
