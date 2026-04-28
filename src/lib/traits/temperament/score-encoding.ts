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
import type { CutoffSet, DimScores } from "./score";

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
export const cutoffHistory: Record<number, CutoffSet> = {
  1: {
    easy: 0.3,
    slowWarm: 0.55,
    cautious: 0.7,
    intensityHigh: 3.5,
    intensityHysteresisBand: 0.4,
    varianceMin: 0.5,
  },
} as const;

// ===== Bit packing helpers =====

function clampDim(value: number): number {
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
  if (!/^[A-Za-z0-9_-]+$/.test(s)) return null;
  const byteCount = Math.floor((s.length * 6) / 8);
  if (byteCount !== 6) return null; // we only accept 8-char inputs (6 bytes)

  const bytes = new Uint8Array(6);
  let bitBuffer = 0;
  let bitCount = 0;
  let byteIndex = 0;

  for (const char of s) {
    const v = B64URL_CHARS.indexOf(char);
    if (v === -1) return null;
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

  // Validate CRC
  const expectedCrc = crc8(bytes.subarray(0, 5));
  if (expectedCrc !== bytes[5]) {
    return { error: "corrupt" };
  }

  // Validate padding bits (byte 4 low 4 bits)
  if ((bytes[4] & 0x0f) !== 0) {
    return { error: "corrupt" };
  }

  // Validate schema version
  const schemaVersion = (bytes[0] >> 4) & 0x0f;
  if (schemaVersion > SCHEMA_VERSION_MAX_SUPPORTED) {
    return { error: "schema_unsupported" };
  }

  const cutoffVersion = bytes[0] & 0x0f;

  // Unpack 9 dims (reverse of encode)
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

  // Re-map 0-4 stored back to likert 1-5, build DimScores keyed by DimensionId
  const dims = {} as DimScores;
  DIMENSION_LIST.forEach((meta, i) => {
    dims[meta.id] = storedToDim(storedDims[i]);
  });

  const lowConfidenceFlag = ((bytes[4] >> 4) & 0x01) === 1;

  return { schemaVersion, cutoffVersion, dims, lowConfidenceFlag };
}
