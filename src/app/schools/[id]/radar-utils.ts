export const SIZE = 240;
export const CENTER = SIZE / 2;
export const RADIUS = 90;

export function polarToCartesian(
  angle: number,
  radius: number
): [number, number] {
  // Start from top (-90°), go clockwise
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

export function getAngles(sides: number): number[] {
  return Array.from({ length: sides }, (_, i) => (360 / sides) * i);
}

/**
 * Subset of School fields needed to build the radar dimensions.
 * Kept structural so the helper doesn't import `@prisma/client` and
 * stays pure / unit-testable.
 */
export type RadarSchoolInput = {
  testPolicy: string | null;
  radarAcceptance: number | null;
  radarInternational: number | null;
  radarSAT: number | null;
  radarCost: number | null;
  radarAid: number | null;
};

export type RadarDim = {
  label: string;
  legendLabel: string;
  value: number;
};

/**
 * Why we might skip the SAT axis on the radar:
 * - "policy": the school is test-free or test-blind. SAT score genuinely
 *   doesn't matter for admissions, so the axis is intentionally omitted.
 * - "missing-data": the school has no SAT radar percentile in our DB
 *   (testPolicy could be required/optional). The axis is omitted because
 *   we can't render a meaningful value, NOT because SAT is irrelevant.
 * - null: SAT axis is shown.
 *
 * The page UI uses this reason to render different copy:
 * "policy" → "该校 SAT 成绩非必须" / "missing-data" → "暂无该校 SAT 数据".
 * Without the distinction we'd falsely tell users that SAT is optional
 * at a test-required school whose radar data simply hasn't loaded yet
 * (Codex R3 finding).
 */
export type SkipSatReason = "policy" | "missing-data" | null;

export type RadarBuildResult = {
  dims: RadarDim[];
  skipSatReason: SkipSatReason;
};

/**
 * Build the radar dimensions for a school. Skips the SAT axis when the
 * school is test-free / test-blind, or has no SAT data — rendering a
 * null SAT as 0 (the "worst score" position) was visually misleading
 * (Codex adversarial review PR #18).
 *
 * Returns both the dim array AND a skipSatReason so the consumer can
 * render context-appropriate legend copy. Pure / unit-testable.
 */
export function buildRadarDimensions(school: RadarSchoolInput): RadarBuildResult {
  const isTestFreeOrBlind =
    school.testPolicy === "free" || school.testPolicy === "blind";
  const hasSatData = school.radarSAT != null;

  let skipSatReason: SkipSatReason = null;
  if (isTestFreeOrBlind) skipSatReason = "policy";
  else if (!hasSatData) skipSatReason = "missing-data";

  const dims: RadarDim[] = [
    { label: "录取", legendLabel: "录取友好度", value: school.radarAcceptance ?? 0 },
    { label: "国际生", legendLabel: "国际生友好度", value: school.radarInternational ?? 0 },
    ...(skipSatReason === null
      ? [{ label: "SAT", legendLabel: "SAT 竞争力", value: school.radarSAT! }]
      : []),
    { label: "费用", legendLabel: "费用可负担度", value: school.radarCost ?? 0 },
    { label: "奖学金", legendLabel: "奖学金力度", value: school.radarAid ?? 0 },
  ];

  return { dims, skipSatReason };
}
