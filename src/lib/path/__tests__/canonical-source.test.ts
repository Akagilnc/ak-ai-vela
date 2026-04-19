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
