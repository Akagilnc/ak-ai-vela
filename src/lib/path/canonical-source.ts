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
/**
 * Decode one segment safely. Tries the whole segment first (common case),
 * then falls back to decoding each `%XX` pair independently so that one
 * malformed escape (e.g. overlong UTF-8 `%c0%ae`) doesn't disable decoding
 * for VALID escapes in the same segment (`%2F`, `%2E%2E`).
 */
function safeDecodeSegment(seg: string): string {
  try {
    return decodeURIComponent(seg);
  } catch {
    return seg.replace(/%[0-9A-Fa-f]{2}/g, (esc) => {
      try {
        return decodeURIComponent(esc);
      } catch {
        return esc; // Keep invalid escape literal (e.g. lone `%c0`).
      }
    });
  }
}

export function canonicalSourcePath(raw: string): string {
  if (typeof raw !== "string") return "/";

  // 0. Length cap — NFKC + regex on unbounded input is an easy DoS vector.
  //    The server boundary enforces Zod max(200) separately; this keeps the
  //    function defensive when called from the client or reused elsewhere.
  let s = raw.length > 2000 ? raw.slice(0, 2000) : raw;

  // 1 + 2 merged: Multi-pass NORMALIZE + DECODE until stable.
  //
  // NFKC must run INSIDE the loop rather than once at the top, because
  // decoded bytes often contain compatibility-form characters that then
  // need folding before the next decode+split cycle:
  //   `%EF%BC%8F` → `／` (full-width slash) → `/` after NFKC → re-splits
  //   `%EF%BC%B0%EF%BC%A1%EF%BC%B4%EF%BC%A8` → `ｐａｔｈ` → `path`
  // Doing NFKC only once at the top would leave these decoded variants
  // as distinct dedup keys.
  //
  // Each pass that changes `s` strictly shortens it (`%XX` → ≤1 byte,
  // NFKC of compatibility forms also shrinks or stays same), so the
  // `pass < s.length` bound is finite and fast. Combined with the
  // 2000-char cap in step 0, worst case is ~20ms.
  for (let pass = 0; pass < s.length; pass++) {
    // NFKC first, then fold the confusable-separator / confusable-dot
    // classes NFKC doesn't cover: backslash + full-width backslash +
    // FRACTION/DIVISION SLASH (U+2044 / U+2215) → `/`, and IDEOGRAPHIC
    // FULL STOP (U+3002) → `.`. Without this, paths like `/foo\\bar`,
    // `/foo⁄bar`, or `/foo/。。/admin` stay as distinct dedup keys even
    // though they represent the same logical page under a Chinese-parent
    // target audience where these characters are commonplace.
    // Full confusable-separator set — ASCII backslash, NFKC-inert
    // mathematical/box-drawing solidus variants that LOOK like `/` or
    // `\` but never fold under NFKC:
    //   `\`        ASCII backslash
    //   U+FF3C     full-width backslash (already NFKC → `\`, kept for belt)
    //   U+2044     FRACTION SLASH `⁄`
    //   U+2215     DIVISION SLASH `∕`
    //   U+2216     SET MINUS `∖`
    //   U+2571     BOX DRAWINGS DIAGONAL `╱`
    //   U+2AFD     DOUBLE SOLIDUS OPERATOR `⫽`
    //   U+29F5     REVERSE SOLIDUS OPERATOR `⧵`
    //   U+29F8     BIG SOLIDUS `⧸`
    //   U+29F9     BIG REVERSE SOLIDUS `⧹`
    // Dot-side: U+3002 IDEOGRAPHIC FULL STOP `。` (common in Chinese text).
    // Add to these lists only if a new confusable is found in a real
    // submission — over-folding risks false-positive dedup.
    const normalized = s
      .normalize("NFKC")
      .replace(
        /[\\\uFF3C\u2044\u2215\u2216\u2571\u2572\u27CB\u27CD\u2AFB\u2AFD\u29F5\u29F8\u29F9]/g,
        "/",
      )
      .replace(/[\u3002]/g, ".");
    const decoded = normalized.split("/").map(safeDecodeSegment).join("/");
    if (decoded === s) break;
    s = decoded;
  }

  // 3. Strip ALL invisible / zero-width / format / control characters via
  //    Unicode property escapes — covers the entire Default_Ignorable_Code_
  //    Point class (~4174 codepoints in Unicode 15.1) in one shot. R3-R14
  //    used hand-enumerated ranges and shipped 4 incomplete passes:
  //      R5  added U+200B-U+200F + BOM + line/para
  //      R7  added \u00A0 NBSP + extended bidi marks
  //      R13 added U+034F + U+115F-1160 + U+180E + U+202A-202E + U+2060-206F
  //          + U+3164 + U+FFA0 + U+FFF0-FFFB + U+E0000-E007F TAG
  //      R14 added U+FE00-U+FE0F (BMP variation selectors) + U+E0100-U+E01EF
  //          (supplementary VS) + U+1D173-U+1D17A (musical invisibles)
  //    Each round, reviewers found the next missing subclass (Discord
  //    "invisible char" U+3164, Trojan-Source U+202A-U+202E, emoji VS-16,
  //    etc.). R15 ends the whack-a-mole by switching to the property escape:
  //    `\p{Default_Ignorable_Code_Point}` matches every codepoint with that
  //    Unicode property, AUTOMATICALLY including any future codepoints the
  //    Unicode Consortium adds (Node's bundled ICU updates).
  //
  //    Kept explicit (NOT in Default_Ignorable per UCD):
  //      \p{Cc}        — C0/C1 controls (NUL, ESC, DEL, etc.)
  //      \u00A0 NBSP   — Zs Space_Separator class
  //      \u2028/\u2029 — Zl/Zp line/para separators
  //
  //    The `u` flag makes the engine surrogate-pair-safe and enables the
  //    `\p{...}` property escape (Node 10+, native V8).
  s = s.replace(
    /[\p{Cc}\p{Default_Ignorable_Code_Point}\u00A0\u2028\u2029]/gu,
    "",
  );

  // 4. Trim ordinary whitespace.
  s = s.trim();

  // 5. Drop query + hash — same logical page.
  const cut = (idx: number) => (idx === -1 ? s.length : idx);
  const end = Math.min(cut(s.indexOf("?")), cut(s.indexOf("#")));
  s = s.slice(0, end);

  // 6. Absolutize — "path" and "./path" collapse to "/path". Without this,
  //    the same logical page submitted by a misbehaving client creates
  //    distinct DB rows under (email, sourcePath).
  if (!s.startsWith("/")) s = "/" + s;

  // 7. Collapse multiple slashes.
  s = s.replace(/\/{2,}/g, "/");

  // 8. Resolve . and .. segments against the now-rooted path.
  const segments = s.slice(1).split("/").filter(Boolean);
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === ".") continue;
    if (seg === "..") {
      resolved.pop();
      continue;
    }
    resolved.push(seg);
  }
  s = "/" + resolved.join("/");

  // 9. Strip trailing slash (except keep the single "/" at root).
  if (s.length > 1) {
    s = s.replace(/\/+$/g, "");
  }
  if (s === "") s = "/";

  // 10. Lowercase — case variants almost never meaningful for path routing.
  return s.toLowerCase();
}
