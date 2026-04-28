/**
 * Score URL encoding/decoding — 6-byte payload → 8 base64url chars.
 *
 * Spec: research notes Section 4.5
 *
 * URL form: `/trait-quiz/result?score=AbCdEfGh`
 *
 * Bit layout (big-endian):
 *   byte 0:  [schemaVer 4][cutoffVer 4]
 *   byte 1:  [dim0 3][dim1 3][dim2 high 2]
 *   byte 2:  [dim2 low 1][dim3 3][dim4 3][dim5 high 1]
 *   byte 3:  [dim5 low 2][dim6 3][dim7 3]
 *   byte 4:  [dim8 3][lowConfidenceFlag 1][padding 4 zero]
 *   byte 5:  [CRC-8 over bytes 0-4]
 *
 * Total = 4+4+27+1+4+8 = 48 bits = 6 bytes = 8 base64url chars.
 *
 * dims encoded as 0-4 (3 bits each), re-mapped from likert 1-5:
 *   encode: likert 1→0, 2→1, 3→2, 4→3, 5→4
 *   decode: stored 0→1, 1→2, 2→3, 3→4, 4→5
 *
 * Note: classify() uses fractional likert (e.g. 3.5) for hysteresis tests, but
 * URL only encodes integer 1-5 (averages computed from 30 raw answers will be
 * rational; we round to nearest integer for encoding to keep URL stable).
 *
 * cutoffHistory: append-only ledger of historical cutoff sets. Old URLs render
 * with their original cutoffs by looking up `cutoffHistory[cutoffVersion]`.
 * NEVER mutate an existing entry — always append new versions.
 */

import { DIMENSION_LIST, type DimensionId } from "./dimensions";
import {
  classify,
  CLASSIFICATION_CONFIG,
  type ClassifyResult,
  type CutoffSet,
  type DimScores,
} from "./score";

const SCHEMA_VERSION_MAX_SUPPORTED = 1;
const CRC_POLY = 0x07;

export interface EncodeInput {
  schemaVersion: 1;
  cutoffVersion: number; // 0-15 (4 bit)
  dims: DimScores;
  lowConfidenceFlag: boolean;
}

export interface DecodeResult {
  schemaVersion: number;
  cutoffVersion: number;
  dims: DimScores;
  lowConfidenceFlag: boolean;
}

export type DecodeError = {
  error: "invalid" | "corrupt" | "schema_unsupported";
};

/**
 * Append-only cutoff history. v1 = launch defaults. After ship + 30+ fills,
 * percentile re-cal triggers a v2 entry. ESLint rule (TODO slice 6) should
 * lint-fail any modification of `cutoffHistory[1]`.
 */
export const cutoffHistory: Readonly<Record<number, Readonly<CutoffSet>>> =
  Object.freeze({
    1: Object.freeze({
      easy: 0.3,
      slowWarm: 0.55,
      cautious: 0.7,
      intensityHigh: 3.5,
      intensityHysteresisBand: 0.4,
      varianceMin: 0.5,
    }),
  });

// ===== Bit packing helpers =====

function clampDim(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`invalid dim score (NaN or Infinity): ${value}`);
  }
  // Round to nearest integer, clamp to 1-5
  const rounded = Math.round(value);
  return Math.max(1, Math.min(5, rounded));
}

function dimToStored(likert: number): number {
  // 1→0, 2→1, ..., 5→4
  return clampDim(likert) - 1;
}

function storedToDim(stored: number): number {
  return stored + 1;
}

// CRC-8 with polynomial 0x07 (CRC-8/SMBUS)
function crc8(bytes: Uint8Array): number {
  let crc = 0;
  for (const b of bytes) {
    crc ^= b;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x80) {
        crc = ((crc << 1) ^ CRC_POLY) & 0xff;
      } else {
        crc = (crc << 1) & 0xff;
      }
    }
  }
  return crc;
}

// ===== base64url encoding (no padding) =====

const B64URL_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bytesToBase64url(bytes: Uint8Array): string {
  // 6 bytes = 48 bits = 8 × 6-bit chunks
  const result: string[] = [];
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    const triplet = (b0 << 16) | (b1 << 8) | b2;
    const chars = [
      B64URL_CHARS[(triplet >> 18) & 0x3f],
      B64URL_CHARS[(triplet >> 12) & 0x3f],
      B64URL_CHARS[(triplet >> 6) & 0x3f],
      B64URL_CHARS[triplet & 0x3f],
    ];
    // Only output as many chars as we have bytes for (no padding)
    const charCount = Math.min(4, Math.ceil(((bytes.length - i) * 8) / 6));
    for (let j = 0; j < charCount; j++) {
      result.push(chars[j]);
    }
  }
  return result.join("");
}

function base64urlToBytes(s: string): Uint8Array | null {
  // Single regex validation — guarantees all chars are valid base64url alphabet
  if (!/^[A-Za-z0-9_-]+$/.test(s)) return null;
  const byteCount = Math.floor((s.length * 6) / 8);
  if (byteCount !== 6) return null; // we only accept 8-char inputs (6 bytes)

  const bytes = new Uint8Array(6);
  let bitBuffer = 0;
  let bitCount = 0;
  let byteIndex = 0;

  for (const char of s) {
    // indexOf safe: regex above guarantees char is in alphabet
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

// ===== Encode =====

export function encodeScore(input: EncodeInput): string {
  const { schemaVersion, cutoffVersion, dims, lowConfidenceFlag } = input;

  if (schemaVersion < 0 || schemaVersion > 15) {
    throw new Error(`schemaVersion out of 4-bit range: ${schemaVersion}`);
  }
  if (cutoffVersion < 0 || cutoffVersion > 15) {
    throw new Error(`cutoffVersion out of 4-bit range: ${cutoffVersion}`);
  }

  // Convert 9 dims (in DIMENSION_LIST order) to 0-4 stored values
  const storedDims = DIMENSION_LIST.map((meta) =>
    dimToStored(dims[meta.id]),
  );

  const bytes = new Uint8Array(6);
  // byte 0: [schemaVer 4][cutoffVer 4]
  bytes[0] = ((schemaVersion & 0x0f) << 4) | (cutoffVersion & 0x0f);
  // byte 1: [dim0 3][dim1 3][dim2 high 2]
  bytes[1] =
    ((storedDims[0] & 0x07) << 5) |
    ((storedDims[1] & 0x07) << 2) |
    ((storedDims[2] & 0x06) >> 1);
  // byte 2: [dim2 low 1][dim3 3][dim4 3][dim5 high 1]
  bytes[2] =
    ((storedDims[2] & 0x01) << 7) |
    ((storedDims[3] & 0x07) << 4) |
    ((storedDims[4] & 0x07) << 1) |
    ((storedDims[5] & 0x04) >> 2);
  // byte 3: [dim5 low 2][dim6 3][dim7 3]
  bytes[3] =
    ((storedDims[5] & 0x03) << 6) |
    ((storedDims[6] & 0x07) << 3) |
    (storedDims[7] & 0x07);
  // byte 4: [dim8 3][lowConfidenceFlag 1][padding 4 zero]
  bytes[4] =
    ((storedDims[8] & 0x07) << 5) |
    ((lowConfidenceFlag ? 1 : 0) << 4);
  // byte 5: CRC-8 over bytes 0-4
  bytes[5] = crc8(bytes.subarray(0, 5));

  return bytesToBase64url(bytes);
}

// ===== Decode =====

export function decodeScore(score: string): DecodeResult | DecodeError {
  if (!score || score.length !== 8) {
    return { error: "invalid" };
  }

  const bytes = base64urlToBytes(score);
  if (!bytes) return { error: "invalid" };

  // Per spec Section 4.5.3: schema check first (before CRC) so future v2
  // URLs return "schema_unsupported" cleanly instead of "corrupt" — v2 may
  // use a different byte layout where v1 CRC math doesn't apply.
  const schemaVersion = (bytes[0] >> 4) & 0x0f;
  if (schemaVersion > SCHEMA_VERSION_MAX_SUPPORTED) {
    return { error: "schema_unsupported" };
  }

  // Validate padding bits (byte 4 low 4 bits) — v1 specific
  if ((bytes[4] & 0x0f) !== 0) {
    return { error: "corrupt" };
  }

  // Validate CRC over bytes 0-4
  const expectedCrc = crc8(bytes.subarray(0, 5));
  if (expectedCrc !== bytes[5]) {
    return { error: "corrupt" };
  }

  const cutoffVersion = bytes[0] & 0x0f;
  // Validate cutoffVersion has a known cutoffHistory entry — guards against
  // tampered URLs claiming a future cutoff version with valid CRC for v1
  // schema (impossible without re-CRC, but defense-in-depth).
  if (!(cutoffVersion in cutoffHistory)) {
    return { error: "schema_unsupported" };
  }

  // Unpack 9 dims (reverse of encode). Each stored value is 3 bits = [0, 7],
  // but valid encoded range is [0, 4] (mapping likert 1-5). Reject 5/6/7
  // even when CRC is valid — a crafted URL with recomputed CRC could
  // otherwise inject impossible dim scores 6-8 into UI/classify (Codex PR
  // #33 R1 P2).
  const storedDims = new Array<number>(9);
  storedDims[0] = (bytes[1] >> 5) & 0x07;
  storedDims[1] = (bytes[1] >> 2) & 0x07;
  storedDims[2] = ((bytes[1] & 0x03) << 1) | ((bytes[2] >> 7) & 0x01);
  storedDims[3] = (bytes[2] >> 4) & 0x07;
  storedDims[4] = (bytes[2] >> 1) & 0x07;
  storedDims[5] = ((bytes[2] & 0x01) << 2) | ((bytes[3] >> 6) & 0x03);
  storedDims[6] = (bytes[3] >> 3) & 0x07;
  storedDims[7] = bytes[3] & 0x07;
  storedDims[8] = (bytes[4] >> 5) & 0x07;
  for (const v of storedDims) {
    if (v > 4) return { error: "corrupt" };
  }

  // Re-map 0-4 stored back to likert 1-5, build DimScores keyed by DimensionId
  const dims = {} as DimScores;
  DIMENSION_LIST.forEach((meta, i) => {
    dims[meta.id] = storedToDim(storedDims[i]);
  });

  const lowConfidenceFlag = ((bytes[4] >> 4) & 0x01) === 1;

  return { schemaVersion, cutoffVersion, dims, lowConfidenceFlag };
}

/**
 * **Quantization invariant** — live quiz path AND URL decode path must produce
 * the same classification for the same user input. This is enforced by:
 *
 *   1. URL encode rounds dim averages to integer 1-5 (`clampDim`)
 *   2. URL decode produces integer dim scores via this rounding
 *   3. Live quiz path MUST also round per-dim averages to integer 1-5 before
 *      calling `classify()` — use `quantizeDimScores()` helper below
 *
 * Without (3), `classify(intensity=3.5)` returns 慎重/low in live but the
 * shared URL renders 慎重/high (intensity rounds to 4, |4-3.5|=0.5 > band/2).
 *
 * Trade-off: hysteresis band on intensity (|x-3.5| < 0.2) effectively never
 * fires for production inputs since integer 3 / 4 are 0.5 away from 3.5.
 * This is intentional — hysteresis was a precision-aware enhancement; URL
 * round-trip safety wins. Slice 3 UI may show "接近 X 型" for adjacent
 * categories via different signal (e.g. cutoff proximity), not via intensity
 * fractional precision.
 */
export function quantizeDimScores(scores: DimScores): DimScores {
  const result = {} as DimScores;
  for (const meta of DIMENSION_LIST) {
    result[meta.id] = clampDim(scores[meta.id]);
  }
  return result;
}

/**
 * Decode a score URL and immediately classify, so result-page rendering
 * doesn't have to manually plumb `cutoffHistory[cutoffVersion]` into a
 * `ClassificationConfig`. Returns full `ClassifyResult` plus the decoded
 * dims (for bar rendering) and version metadata.
 */
export type DecodeAndClassifyResult = ClassifyResult & {
  schemaVersion: number;
  cutoffVersion: number;
  dims: DimScores;
};

export function decodeAndClassifyScore(
  score: string,
): DecodeAndClassifyResult | DecodeError {
  const decoded = decodeScore(score);
  if ("error" in decoded) return decoded;

  const cutoffSet = cutoffHistory[decoded.cutoffVersion];
  // Decoded.cutoffVersion in cutoffHistory is guaranteed by decodeScore
  const config = {
    ...CLASSIFICATION_CONFIG,
    cutoffs: cutoffSet,
  };

  const result = classify({
    scores: decoded.dims,
    lowConfidenceFlag: decoded.lowConfidenceFlag,
    config,
  });

  return {
    ...result,
    schemaVersion: decoded.schemaVersion,
    cutoffVersion: decoded.cutoffVersion,
    dims: decoded.dims,
  };
}
