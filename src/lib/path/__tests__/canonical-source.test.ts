import { describe, it, expect } from "vitest";
import { canonicalSourcePath } from "../canonical-source";

/**
 * Regression suite for canonicalSourcePath.
 *
 * This function has been hardened across cross-review rounds R1-R8 against
 * real attack vectors (encoding smuggling, compatibility-form bypass, dot-
 * segment traversal, confusable separators). Each `describe` below pins one
 * class of attack so future changes can't silently reintroduce the bypass.
 */

describe("canonicalSourcePath — basic inputs", () => {
  it("absolute path passes through lowercased", () => {
    expect(canonicalSourcePath("/path")).toBe("/path");
  });

  it("empty string returns root", () => {
    expect(canonicalSourcePath("")).toBe("/");
  });

  it("non-string returns root", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(canonicalSourcePath(null as any)).toBe("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(canonicalSourcePath(undefined as any)).toBe("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(canonicalSourcePath({} as any)).toBe("/");
  });
});

describe("canonicalSourcePath — whitespace + control bytes (R3-R5)", () => {
  it.each([
    ["/path ", "/path"],
    [" /path", "/path"],
    ["/path\u00A0", "/path"],
    ["/path\u200B", "/path"],
    ["/path\uFEFF", "/path"],
    ["/path\u0000", "/path"],
    ["/path\u0001", "/path"],
    ["/path\u007F", "/path"],
  ])("strip %p -> %p", (input, expected) => {
    expect(canonicalSourcePath(input)).toBe(expected);
  });
});

describe("canonicalSourcePath — query + hash (R3)", () => {
  it("drops ?query", () => {
    expect(canonicalSourcePath("/path?x=1&y=2")).toBe("/path");
  });

  it("drops #hash", () => {
    expect(canonicalSourcePath("/path#anchor")).toBe("/path");
  });
});

describe("canonicalSourcePath — case folding (R3)", () => {
  it("lowercases ASCII", () => {
    expect(canonicalSourcePath("/PATH")).toBe("/path");
  });
});

describe("canonicalSourcePath — absolutize relative (R4)", () => {
  it.each([
    ["path", "/path"],
    ["./path", "/path"],
    ["path/admin", "/path/admin"],
  ])("relative %p -> %p", (input, expected) => {
    expect(canonicalSourcePath(input)).toBe(expected);
  });
});

describe("canonicalSourcePath — multi-slash collapse (R3)", () => {
  it.each([
    ["//path", "/path"],
    ["///path", "/path"],
    ["/foo//bar", "/foo/bar"],
  ])("collapse %p -> %p", (input, expected) => {
    expect(canonicalSourcePath(input)).toBe(expected);
  });
});

describe("canonicalSourcePath — dot-segment resolution (R3)", () => {
  it.each([
    ["/path/../admin", "/admin"],
    ["/path/./admin", "/path/admin"],
    ["/./path", "/path"],
    ["/../path", "/path"], // pop past root is no-op
  ])("resolve %p -> %p", (input, expected) => {
    expect(canonicalSourcePath(input)).toBe(expected);
  });
});

describe("canonicalSourcePath — percent-encoding (R4-R6)", () => {
  it("simple %XX decodes", () => {
    expect(canonicalSourcePath("/%2E%2E/admin")).toBe("/admin");
  });

  it("double-encoded dots decode through layers", () => {
    expect(canonicalSourcePath("/%252E%252E/admin")).toBe("/admin");
  });

  it("deeply nested (5+ layers) decode through layers (R6)", () => {
    expect(canonicalSourcePath("/%25252525252E%25252525252E/admin")).toBe(
      "/admin",
    );
  });

  it("mixed malformed + valid escapes in one segment (R5-R7)", () => {
    expect(canonicalSourcePath("/%c0%ae%2F%2E%2E/admin")).toBe("/admin");
  });

  it("invalid hex (%GG) stays literal", () => {
    expect(canonicalSourcePath("/%GG")).toBe("/%gg");
  });

  it("encoded slash (%2F) splits correctly on next pass", () => {
    expect(canonicalSourcePath("/foo%2Fbar")).toBe("/foo/bar");
  });

  it("encoded nul (%00) stripped after decode (R5)", () => {
    expect(canonicalSourcePath("/path%00")).toBe("/path");
  });
});

describe("canonicalSourcePath — NFKC compatibility forms (R7)", () => {
  it("full-width path letters fold to ASCII", () => {
    expect(canonicalSourcePath("/\uFF50\uFF41\uFF54\uFF48")).toBe("/path");
  });

  it("encoded full-width letters decode then fold on next pass", () => {
    expect(
      canonicalSourcePath("/%EF%BC%B0%EF%BC%A1%EF%BC%B4%EF%BC%A8"),
    ).toBe("/path");
  });

  it("encoded full-width slash (%EF%BC%8F) decodes and splits", () => {
    expect(canonicalSourcePath("/%EF%BC%8Fpath")).toBe("/path");
  });

  it("encoded full-width dots (%EF%BC%8E%EF%BC%8E) resolve as ..", () => {
    expect(canonicalSourcePath("/%EF%BC%8E%EF%BC%8E/admin")).toBe("/admin");
  });
});

describe("canonicalSourcePath — confusable separators (R8)", () => {
  it("ASCII backslash treated as separator", () => {
    expect(canonicalSourcePath("/foo\\bar")).toBe("/foo/bar");
  });

  it("encoded backslash (%5C) treated as separator", () => {
    expect(canonicalSourcePath("/foo%5Cbar")).toBe("/foo/bar");
  });

  it("full-width backslash (U+FF3C) treated as separator", () => {
    expect(canonicalSourcePath("/foo\uFF3Cbar")).toBe("/foo/bar");
  });

  it("FRACTION SLASH (U+2044) treated as separator", () => {
    expect(canonicalSourcePath("/foo\u2044bar")).toBe("/foo/bar");
  });

  it("DIVISION SLASH (U+2215) treated as separator", () => {
    expect(canonicalSourcePath("/foo\u2215bar")).toBe("/foo/bar");
  });

  it("IDEOGRAPHIC FULL STOP (U+3002) folds to . and resolves as ..", () => {
    expect(canonicalSourcePath("/foo/\u3002\u3002/admin")).toBe("/admin");
  });

  it.each([
    ["\u2216", "SET MINUS `∖`"],
    ["\u2571", "BOX DRAWINGS DIAGONAL `╱`"],
    ["\u2572", "BOX DRAWINGS ANTI-DIAGONAL `╲`"],
    ["\u27CB", "MATHEMATICAL RISING DIAGONAL `⟋`"],
    ["\u27CD", "MATHEMATICAL FALLING DIAGONAL `⟍`"],
    ["\u2AFB", "TRIPLE SOLIDUS BINARY RELATION `⫻`"],
    ["\u2AFD", "DOUBLE SOLIDUS OPERATOR `⫽`"],
    ["\u29F5", "REVERSE SOLIDUS OPERATOR `⧵`"],
    ["\u29F8", "BIG SOLIDUS `⧸`"],
    ["\u29F9", "BIG REVERSE SOLIDUS `⧹`"],
  ])("NFKC-inert math/box-drawing separator %p (%s) folds to /", (char) => {
    expect(canonicalSourcePath(`/foo${char}bar`)).toBe("/foo/bar");
  });
});

describe("canonicalSourcePath — Default_Ignorable / bidi / TAG smuggling (R13)", () => {
  it.each([
    ["U+034F COMBINING GRAPHEME JOINER", "/pa\u034Fth"],
    ["U+115F HANGUL CHOSEONG FILLER", "/pa\u115Fth"],
    ["U+1160 HANGUL JUNGSEONG FILLER", "/pa\u1160th"],
    ["U+180E MONGOLIAN VOWEL SEPARATOR", "/pa\u180Eth"],
    ["U+202A LEFT-TO-RIGHT EMBEDDING", "/pa\u202Ath"],
    ["U+202B RIGHT-TO-LEFT EMBEDDING", "/pa\u202Bth"],
    ["U+202C POP DIRECTIONAL FORMATTING", "/pa\u202Cth"],
    ["U+202D LEFT-TO-RIGHT OVERRIDE", "/pa\u202Dth"],
    ["U+202E RIGHT-TO-LEFT OVERRIDE", "/pa\u202Eth"],
    ["U+2060 WORD JOINER", "/pa\u2060th"],
    ["U+2066 LEFT-TO-RIGHT ISOLATE", "/pa\u2066th"],
    ["U+2067 RIGHT-TO-LEFT ISOLATE", "/pa\u2067th"],
    ["U+2068 FIRST STRONG ISOLATE", "/pa\u2068th"],
    ["U+2069 POP DIRECTIONAL ISOLATE", "/pa\u2069th"],
    ["U+3164 HANGUL FILLER", "/pa\u3164th"],
    ["U+FFA0 HALFWIDTH HANGUL FILLER", "/pa\uFFA0th"],
  ])("%s strips to /path", (_name, input) => {
    expect(canonicalSourcePath(input)).toBe("/path");
  });

  it("U+E0000 TAG (steganography supplementary-plane char) strips", () => {
    expect(canonicalSourcePath("/pa\u{E0000}th")).toBe("/path");
  });

  it("U+E0061 TAG LATIN SMALL LETTER A strips", () => {
    expect(canonicalSourcePath("/pa\u{E0061}th")).toBe("/path");
  });

  it("U+E007F CANCEL TAG (high end of TAG range) strips", () => {
    expect(canonicalSourcePath("/pa\u{E007F}th")).toBe("/path");
  });

  it("multiple invisible chars in one segment all strip", () => {
    expect(
      canonicalSourcePath("/pa\u3164\u200B\u202A\u{E0000}th"),
    ).toBe("/path");
  });

  it("percent-encoded TAG char (UTF-8 F3A08080) decodes then strips", () => {
    // %F3%A0%80%80 = U+E0000 in UTF-8
    expect(canonicalSourcePath("/pa%F3%A0%80%80th")).toBe("/path");
  });

  it("percent-encoded HANGUL FILLER (UTF-8 E385A4) decodes then strips", () => {
    // %E3%85%A4 = U+3164 in UTF-8
    expect(canonicalSourcePath("/pa%E3%85%A4th")).toBe("/path");
  });
});

describe("canonicalSourcePath — Variation Selectors + musical invisibles (R14)", () => {
  it.each([
    ["U+FE00 VS1", "/pa\uFE00th"],
    ["U+FE0E VS15 (text presentation)", "/pa\uFE0Eth"],
    ["U+FE0F VS16 (emoji presentation)", "/pa\uFE0Fth"],
  ])("BMP variation selector %s strips", (_name, input) => {
    expect(canonicalSourcePath(input)).toBe("/path");
  });

  it("U+E0100 supplementary VS17 strips", () => {
    expect(canonicalSourcePath("/pa\u{E0100}th")).toBe("/path");
  });

  it("U+E01EF supplementary VS256 (high end) strips", () => {
    expect(canonicalSourcePath("/pa\u{E01EF}th")).toBe("/path");
  });

  it("U+1D173 MUSICAL SYMBOL BEGIN BEAM strips", () => {
    expect(canonicalSourcePath("/pa\u{1D173}th")).toBe("/path");
  });

  it("U+1D17A MUSICAL SYMBOL END PHRASE strips", () => {
    expect(canonicalSourcePath("/pa\u{1D17A}th")).toBe("/path");
  });

  it("percent-encoded VS-16 (UTF-8 EFB88F) decodes then strips", () => {
    // %EF%B8%8F = U+FE0F in UTF-8
    expect(canonicalSourcePath("/pa%EF%B8%8Fth")).toBe("/path");
  });

  it("percent-encoded supplementary VS17 (UTF-8 F3A08480) decodes then strips", () => {
    // %F3%A0%84%80 = U+E0100 in UTF-8
    expect(canonicalSourcePath("/pa%F3%A0%84%80th")).toBe("/path");
  });
});

describe("canonicalSourcePath — comprehensive Default_Ignorable coverage (R15)", () => {
  // R15 switched from manual ranges to \p{Default_Ignorable_Code_Point}.
  // These pin classes that previous rounds missed but the property escape
  // now catches automatically. If anyone narrows the regex back to
  // hand-enumerated ranges, these break.
  it.each([
    ["U+00AD SOFT HYPHEN", "/pa\u00ADth"],
    ["U+061C ARABIC LETTER MARK", "/pa\u061Cth"],
    ["U+180B MONGOLIAN FREE VARIATION SELECTOR ONE", "/pa\u180Bth"],
    ["U+180C MONGOLIAN FREE VARIATION SELECTOR TWO", "/pa\u180Cth"],
    ["U+180D MONGOLIAN FREE VARIATION SELECTOR THREE", "/pa\u180Dth"],
    ["U+180F MONGOLIAN FREE VARIATION SELECTOR FOUR", "/pa\u180Fth"],
    ["U+17B4 KHMER VOWEL INHERENT AQ", "/pa\u17B4th"],
    ["U+17B5 KHMER VOWEL INHERENT AA", "/pa\u17B5th"],
    ["U+1BCA0 SHORTHAND FORMAT LETTER OVERLAP", "/pa\u{1BCA0}th"],
    ["U+1BCA3 SHORTHAND FORMAT UP STEP", "/pa\u{1BCA3}th"],
  ])("%s strips via \\p{Default_Ignorable_Code_Point}", (_name, input) => {
    expect(canonicalSourcePath(input)).toBe("/path");
  });

  it("multiple Default_Ignorable classes in one path strip", () => {
    expect(
      canonicalSourcePath("/pa\u00AD\u061C\u180D\uFE0F\u3164th"),
    ).toBe("/path");
  });

  it("percent-encoded SOFT HYPHEN (UTF-8 C2AD) decodes then strips", () => {
    expect(canonicalSourcePath("/pa%C2%ADth")).toBe("/path");
  });

  it("percent-encoded ARABIC LETTER MARK (UTF-8 D89C) decodes then strips", () => {
    expect(canonicalSourcePath("/pa%D8%9Cth")).toBe("/path");
  });
});

describe("canonicalSourcePath — DoS resistance", () => {
  it("caps overlong input at 2000 chars", () => {
    const huge = "/" + "x".repeat(5000);
    const result = canonicalSourcePath(huge);
    expect(result.length).toBeLessThanOrEqual(2001); // "/" + up to 2000 chars
  });

  it("adversarial 2000-char nested encoding converges quickly", () => {
    const start = Date.now();
    canonicalSourcePath("/" + "%25".repeat(650) + "2E/admin");
    expect(Date.now() - start).toBeLessThan(100);
  });
});
