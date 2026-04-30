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
  decodeAndClassifyScore,
  decodeScore,
  encodeScore,
  quantizeDimScores,
  type DecodeError,
  type DecodeResult,
  type EncodeInput,
} from "../score-encoding";
import { classify, CLASSIFICATION_CONFIG, type DimScores } from "../score";

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

describe("decodeScore — additional R1 fixes", () => {
  it("rejects '.' in input (not in base64url alphabet)", () => {
    const result = decodeScore("AAAA.AAA");
    expect(result).toEqual(expect.objectContaining({ error: "invalid" }));
  });

  it("returns schema_unsupported when cutoffVersion has no history entry", () => {
    // Encode with cutoffVersion=7 (no history entry exists)
    const encoded = encodeScore({ ...baseInput, cutoffVersion: 7 });
    const result = decodeScore(encoded);
    expect(result).toEqual(
      expect.objectContaining({ error: "schema_unsupported" }),
    );
  });

  it("returns corrupt when padding bits are non-zero (hand-crafted)", () => {
    // Generate valid encoding then flip padding bits at byte 4 low nibble
    const valid = encodeScore(baseInput);
    const validBytes = decodeScoreToBytes(valid);
    if (!validBytes) throw new Error("test setup failed");
    validBytes[4] |= 0x0f; // set all padding bits to 1
    // Re-encode with valid CRC over the tampered bytes
    validBytes[5] = crc8ForTest(validBytes.subarray(0, 5));
    const tamperedB64 = bytesToB64urlForTest(validBytes);
    const result = decodeScore(tamperedB64);
    expect(result).toEqual(expect.objectContaining({ error: "corrupt" }));
  });
});

describe("encodeScore — input validation", () => {
  it("throws on NaN dim score", () => {
    expect(() =>
      encodeScore({
        ...baseInput,
        dims: { ...sampleDims, intensity: NaN },
      }),
    ).toThrow(/invalid dim score/);
  });

  it("throws on Infinity dim score", () => {
    expect(() =>
      encodeScore({
        ...baseInput,
        dims: { ...sampleDims, intensity: Infinity },
      }),
    ).toThrow(/invalid dim score/);
  });

  it("clamps dim score above 5 silently (intentional, e.g. classify uses 3.5)", () => {
    const encoded = encodeScore({
      ...baseInput,
      dims: { ...sampleDims, intensity: 7 }, // out of range
    });
    const result = decodeScore(encoded);
    if ("error" in result) throw new Error("decode failed");
    expect(result.dims.intensity).toBe(5); // clamped to max
  });

  it("clamps dim score below 1 silently", () => {
    const encoded = encodeScore({
      ...baseInput,
      dims: { ...sampleDims, intensity: 0 },
    });
    const result = decodeScore(encoded);
    if ("error" in result) throw new Error("decode failed");
    expect(result.dims.intensity).toBe(1); // clamped to min
  });
});

// Test-only helpers (don't export from production module)
function decodeScoreToBytes(s: string): Uint8Array | null {
  // Mirror of internal base64urlToBytes for test use
  const B64URL_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  if (!/^[A-Za-z0-9_-]+$/.test(s)) return null;
  if (s.length !== 8) return null;
  const bytes = new Uint8Array(6);
  let bitBuffer = 0;
  let bitCount = 0;
  let byteIndex = 0;
  for (const char of s) {
    const v = B64URL_CHARS.indexOf(char);
    bitBuffer = (bitBuffer << 6) | v;
    bitCount += 6;
    while (bitCount >= 8 && byteIndex < 6) {
      bitCount -= 8;
      bytes[byteIndex++] = (bitBuffer >> bitCount) & 0xff;
    }
  }
  return bytes;
}

function crc8ForTest(bytes: Uint8Array): number {
  let crc = 0;
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff;
    }
  }
  return crc;
}

function bytesToB64urlForTest(bytes: Uint8Array): string {
  const B64URL_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const result: string[] = [];
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    const triplet = (b0 << 16) | (b1 << 8) | b2;
    const charCount = Math.min(4, Math.ceil(((bytes.length - i) * 8) / 6));
    for (let j = 0; j < charCount; j++) {
      result.push(B64URL_CHARS[(triplet >> (18 - j * 6)) & 0x3f]);
    }
  }
  return result.join("");
}

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

describe("quantizeDimScores — quantization invariant for live path", () => {
  it("rounds fractional avg to integer 1-5", () => {
    const fractional: DimScores = {
      activityLevel: 3.5,
      rhythmicity: 1.25,
      approach: 4.75,
      adaptability: 2.5,
      intensity: 3.5, // critical: this is what causes URL/live mismatch
      threshold: 3.0,
      mood: 1.0,
      distractibility: 4.5,
      persistence: 5.0,
    };
    const quantized = quantizeDimScores(fractional);
    expect(quantized.activityLevel).toBe(4); // 3.5 → 4
    expect(quantized.rhythmicity).toBe(1); // 1.25 → 1
    expect(quantized.approach).toBe(5); // 4.75 → 5
    expect(quantized.adaptability).toBe(3); // 2.5 → 3 (banker's? Math.round → 3)
    expect(quantized.intensity).toBe(4); // 3.5 → 4
    expect(quantized.threshold).toBe(3);
    expect(quantized.mood).toBe(1);
    expect(quantized.distractibility).toBe(5); // 4.5 → 5
    expect(quantized.persistence).toBe(5);
  });

  it("integer input passes through unchanged", () => {
    const integer: DimScores = {
      activityLevel: 3, rhythmicity: 1, approach: 5, adaptability: 1,
      intensity: 5, threshold: 3, mood: 1, distractibility: 3, persistence: 3,
    };
    expect(quantizeDimScores(integer)).toEqual(integer);
  });

  it("clamps out-of-range values silently", () => {
    expect(quantizeDimScores({ ...sampleDims, intensity: 7 }).intensity).toBe(5);
    expect(quantizeDimScores({ ...sampleDims, intensity: 0 }).intensity).toBe(1);
  });

  it("throws on NaN/Infinity (matches encode behavior)", () => {
    expect(() =>
      quantizeDimScores({ ...sampleDims, intensity: NaN }),
    ).toThrow(/invalid dim score/);
  });

  it("invariant: classify(quantize(x)) === decodeAndClassify(encode(quantize(x)))", () => {
    // The whole point: live and URL paths agree post-quantize.
    const fractional: DimScores = {
      activityLevel: 3.4, rhythmicity: 1.6, approach: 4.4, adaptability: 1.5,
      intensity: 3.5, threshold: 2.5, mood: 1.5, distractibility: 3.0, persistence: 4.5,
    };
    const quantized = quantizeDimScores(fractional);
    const encoded = encodeScore({
      schemaVersion: 1,
      cutoffVersion: 1,
      dims: quantized,
      lowConfidenceFlag: false,
    });
    const urlResult = decodeAndClassifyScore(encoded);
    if ("error" in urlResult) throw new Error("decode failed");

    // Live path: classify directly on quantized
    const liveResult = classify({
      scores: quantized,
      lowConfidenceFlag: false,
      config: CLASSIFICATION_CONFIG,
    });

    expect(urlResult.type).toBe(liveResult.type);
    expect(urlResult.confidence).toBe(liveResult.confidence);
  });
});

describe("decodeAndClassifyScore — wrapper for result page", () => {
  it("returns full ClassifyResult + dims + version metadata", () => {
    const encoded = encodeScore({
      schemaVersion: 1,
      cutoffVersion: 1,
      dims: { activityLevel: 3, rhythmicity: 1, approach: 5, adaptability: 1,
              intensity: 5, threshold: 3, mood: 1, distractibility: 3, persistence: 3 },
      lowConfidenceFlag: false,
    });
    const result = decodeAndClassifyScore(encoded);
    if ("error" in result) throw new Error("decode failed");

    expect(result.type).toBe("慎重型");
    expect(result.confidence).toBe("high");
    expect(result.dims).toBeDefined();
    expect(result.cutoffVersion).toBe(1);
    expect(result.schemaVersion).toBe(1);
    expect(result.rawCore).toBeCloseTo(1.0, 2); // post-PR#33 R1 symmetric core
  });

  it("propagates decode errors unchanged (empty / wrong length / bad chars)", () => {
    expect(decodeAndClassifyScore("")).toEqual(
      expect.objectContaining({ error: "invalid" }),
    );
    expect(decodeAndClassifyScore("AAA")).toEqual(
      expect.objectContaining({ error: "invalid" }),
    );
    expect(decodeAndClassifyScore("AAAA.AAA")).toEqual(
      expect.objectContaining({ error: "invalid" }),
    );
  });

  it("uses cutoffHistory[cutoffVersion] for classification (cross-version safety)", () => {
    // Encode with cutoffVersion=1
    const encoded = encodeScore({
      schemaVersion: 1,
      cutoffVersion: 1,
      dims: { activityLevel: 3, rhythmicity: 3, approach: 3, adaptability: 3,
              intensity: 3, threshold: 3, mood: 3, distractibility: 3, persistence: 3 },
      lowConfidenceFlag: true,
    });
    const result = decodeAndClassifyScore(encoded);
    if ("error" in result) throw new Error("decode failed");
    expect(result.type).toBe("平衡型");
    expect(result.confidence).toBe("low");
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
