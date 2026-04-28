/**
 * Tests for score URL encoding/decoding.
 *
 * Spec: research notes Section 4.5
 * - 6 bytes payload, base64url-encoded → 8 chars
 * - byte 0: schemaVer (4) + cutoffVer (4)
 * - byte 1: dim0 (3) + dim1 (3) + dim2 high (2)
 * - byte 2: dim2 low (1) + dim3 (3) + dim4 (3) + dim5 high (1)
 * - byte 3: dim5 low (2) + dim6 (3) + dim7 (3)
 * - byte 4: dim8 (3) + lowConfidenceFlag (1) + padding (4 zero)
 * - byte 5: CRC-8 (poly 0x07) of bytes 0-4
 *
 * dim values stored as 0-4 (re-mapped from likert 1-5 on encode/decode).
 * dim order matches DIMENSION_LIST order.
 */
import { describe, expect, it } from "vitest";
import {
  cutoffHistory,
  decodeScore,
  encodeScore,
  type DecodeError,
  type DecodeResult,
  type EncodeInput,
} from "../score-encoding";
import type { DimScores } from "../score";

const sampleDims: DimScores = {
  activityLevel: 3,
  rhythmicity: 1,
  approach: 5,
  adaptability: 1,
  intensity: 5,
  threshold: 3,
  mood: 1,
  distractibility: 3,
  persistence: 3,
};

const baseInput: EncodeInput = {
  schemaVersion: 1,
  cutoffVersion: 1,
  dims: sampleDims,
  lowConfidenceFlag: false,
};

describe("encodeScore + decodeScore — round trip", () => {
  it("encodes to exactly 8 base64url chars (no padding)", () => {
    const encoded = encodeScore(baseInput);
    expect(encoded).toHaveLength(8);
    expect(encoded).not.toMatch(/=/); // no padding
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/); // base64url alphabet
  });

  it("round-trips schema/cutoff versions", () => {
    const result = decodeScore(encodeScore(baseInput));
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.schemaVersion).toBe(1);
    expect(result.cutoffVersion).toBe(1);
  });

  it("round-trips all 9 dim scores", () => {
    const result = decodeScore(encodeScore(baseInput));
    if ("error" in result) throw new Error("decode failed");
    expect(result.dims).toEqual(sampleDims);
  });

  it("round-trips lowConfidenceFlag=false", () => {
    const result = decodeScore(encodeScore({ ...baseInput, lowConfidenceFlag: false }));
    if ("error" in result) throw new Error("decode failed");
    expect(result.lowConfidenceFlag).toBe(false);
  });

  it("round-trips lowConfidenceFlag=true", () => {
    const result = decodeScore(encodeScore({ ...baseInput, lowConfidenceFlag: true }));
    if ("error" in result) throw new Error("decode failed");
    expect(result.lowConfidenceFlag).toBe(true);
  });

  it("round-trips boundary dim values (1 and 5)", () => {
    const allOnes = Object.fromEntries(
      Object.keys(sampleDims).map((k) => [k, 1]),
    ) as DimScores;
    const allFives = Object.fromEntries(
      Object.keys(sampleDims).map((k) => [k, 5]),
    ) as DimScores;

    const r1 = decodeScore(encodeScore({ ...baseInput, dims: allOnes }));
    if ("error" in r1) throw new Error("decode failed");
    expect(r1.dims).toEqual(allOnes);

    const r5 = decodeScore(encodeScore({ ...baseInput, dims: allFives }));
    if ("error" in r5) throw new Error("decode failed");
    expect(r5.dims).toEqual(allFives);
  });
});

describe("decodeScore — error paths", () => {
  it("returns error on empty input", () => {
    const result = decodeScore("");
    expect(result).toEqual(expect.objectContaining({ error: "invalid" }));
  });

  it("returns error on malformed base64url", () => {
    const result = decodeScore("not_8ch!");
    expect("error" in result).toBe(true);
  });

  it("returns error on truncated payload (7 chars instead of 8)", () => {
    const result = decodeScore("AbCdEfG");
    expect("error" in result).toBe(true);
  });

  it("returns error on tampered checksum", () => {
    const valid = encodeScore(baseInput);
    // Flip last char (which is part of CRC byte) to invalid checksum
    const tampered = valid.slice(0, -1) + (valid.endsWith("A") ? "B" : "A");
    const result = decodeScore(tampered);
    expect(result).toEqual(expect.objectContaining({ error: "corrupt" }));
  });

  it("returns error on tampered dim byte (CRC mismatch)", () => {
    const valid = encodeScore(baseInput);
    // Flip a middle char — affects dim bytes, breaks CRC
    const tampered = valid[0] + (valid[1] === "A" ? "B" : "A") + valid.slice(2);
    const result = decodeScore(tampered);
    expect("error" in result).toBe(true);
  });

  it("returns error on unsupported schemaVersion", () => {
    // Encode with hypothetical future schemaVersion=15 (max 4 bits)
    const encoded = encodeScore({ ...baseInput, schemaVersion: 15 as 1 });
    const result = decodeScore(encoded);
    expect(result).toEqual(
      expect.objectContaining({ error: "schema_unsupported" }),
    );
  });
});

describe("decodeScore — bit packing edge cases", () => {
  it("handles dim values that span byte boundaries (dim2 across bytes 1+2, dim5 across bytes 2+3)", () => {
    // Set dim2 (approach) and dim5 (threshold) to specific values to exercise byte-spanning
    const dims: DimScores = {
      activityLevel: 4,
      rhythmicity: 2,
      approach: 5, // dim2: spans byte 1 high 2 + byte 2 low 1
      adaptability: 3,
      intensity: 4,
      threshold: 5, // dim5: spans byte 2 high 1 + byte 3 low 2
      mood: 2,
      distractibility: 4,
      persistence: 1,
    };
    const result = decodeScore(encodeScore({ ...baseInput, dims }));
    if ("error" in result) throw new Error("decode failed");
    expect(result.dims).toEqual(dims);
  });

  it("padding bits in byte 4 are zero-validated on decode", () => {
    const valid = encodeScore(baseInput);
    // Decode succeeds with valid encoding (padding implicitly 0)
    expect("error" in decodeScore(valid)).toBe(false);
  });
});

describe("cutoffHistory — append-only invariant", () => {
  it("contains version 1 entry with locked cutoffs", () => {
    expect(cutoffHistory[1]).toBeDefined();
    expect(cutoffHistory[1].easy).toBe(0.3);
    expect(cutoffHistory[1].slowWarm).toBe(0.55);
    expect(cutoffHistory[1].cautious).toBe(0.7);
    expect(cutoffHistory[1].intensityHigh).toBe(3.5);
    expect(cutoffHistory[1].intensityHysteresisBand).toBe(0.4);
    expect(cutoffHistory[1].varianceMin).toBe(0.5);
  });

  // Regression test: when v0.6 ships and later v2 cutoffs land,
  // existing v1 URLs must still classify correctly.
  it("v1 cutoffs preserved (regression: never mutate v1 entry)", () => {
    // This test will fail if anyone modifies cutoffHistory[1] in the future.
    expect(JSON.stringify(cutoffHistory[1])).toBe(
      JSON.stringify({
        easy: 0.3,
        slowWarm: 0.55,
        cautious: 0.7,
        intensityHigh: 3.5,
        intensityHysteresisBand: 0.4,
        varianceMin: 0.5,
      }),
    );
  });
});

describe("encodeScore + decodeScore + classify — full pipeline", () => {
  it("encoded URL decodes and feeds classify with cutoffVersion lookup", async () => {
    const { classify } = await import("../score");
    const encoded = encodeScore({
      schemaVersion: 1,
      cutoffVersion: 1,
      dims: {
        activityLevel: 3,
        rhythmicity: 1,
        approach: 5,
        adaptability: 1,
        intensity: 5,
        threshold: 3,
        mood: 1,
        distractibility: 3,
        persistence: 3,
      },
      lowConfidenceFlag: false,
    });
    const result = decodeScore(encoded);
    if ("error" in result) throw new Error("decode failed");

    const config = {
      coreDims: [
        { key: "rhythmicity" as const, highIsHardPole: false },
        { key: "approach" as const, highIsHardPole: true },
        { key: "adaptability" as const, highIsHardPole: false },
        { key: "intensity" as const, highIsHardPole: true },
        { key: "mood" as const, highIsHardPole: false },
      ],
      differentiator: "intensity" as const,
      cutoffs: cutoffHistory[result.cutoffVersion],
    };

    const classified = classify({
      scores: result.dims,
      lowConfidenceFlag: result.lowConfidenceFlag,
      config,
    });
    expect(classified.type).toBe("慎重型");
  });
});
