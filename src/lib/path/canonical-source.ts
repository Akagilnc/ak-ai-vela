/**
 * Canonicalize a `sourcePath` value so PathInterest @@unique([email, sourcePath])
 * can't be bypassed by visually-identical but byte-different inputs.
 *
 * Pipeline:
 *   1. NFKC normalize — collapse full-width vs half-width / compatibility
 *      forms so users typing "/ｐａｔｈ" dedup with "/path".
 *   2. Strip invisible / zero-width chars (U+200B ZWSP, U+200C/D joiners,
 *      U+FEFF BOM, U+2028/9 line/paragraph separators, U+00A0 nbsp) that
 *      .trim() alone doesn't touch.
 *   3. Trim ordinary whitespace.
 *   4. Strip query (?…) and hash (#…) — same logical page.
 *   5. Collapse multiple consecutive slashes ("//a/b" → "/a/b").
 *   6. Resolve "." and ".." segments defensively — prevents "/path/../admin"
 *      collapsing to "/admin" from being stored as a distinct key.
 *   7. Strip trailing slash (except for root "/").
 *   8. Lowercase — case variants are almost never semantically meaningful
 *      for internal path routing.
 *
 * Shared by `src/app/api/path/interest/route.ts` (server, authoritative) and
 * `src/components/path/path-interest-form.tsx` (client, best-effort so the
 * request body is already clean). Server ALWAYS re-runs this even if client
 * already did — don't trust client input.
 */
export function canonicalSourcePath(raw: string): string {
  if (typeof raw !== "string") return "/";

  // 1. Unicode normalize
  let s = raw.normalize("NFKC");

  // 2. Strip invisible chars
  s = s.replace(/[\u00A0\u200B-\u200F\u2028\u2029\uFEFF]/g, "");

  // 3. Trim ordinary whitespace
  s = s.trim();

  // 4. Drop query + hash
  const cut = (idx: number) => (idx === -1 ? s.length : idx);
  const end = Math.min(cut(s.indexOf("?")), cut(s.indexOf("#")));
  s = s.slice(0, end);

  // 5. Collapse multiple slashes
  s = s.replace(/\/{2,}/g, "/");

  // 6. Resolve . and .. segments
  if (s.includes("/")) {
    const leading = s.startsWith("/") ? "/" : "";
    const segments = s.split("/").filter(Boolean);
    const out: string[] = [];
    for (const seg of segments) {
      if (seg === ".") continue;
      if (seg === "..") {
        out.pop();
        continue;
      }
      out.push(seg);
    }
    s = leading + out.join("/");
  }

  // 7. Strip trailing slash (except keep the single "/" at root)
  if (s.length > 1) {
    s = s.replace(/\/+$/g, "");
  }
  if (s === "") s = "/";

  // 8. Lowercase
  return s.toLowerCase();
}
