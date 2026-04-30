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
 * Build the radar dimensions for a school. Skips the SAT axis when the
 * school is test-free / test-blind, or has no SAT data — rendering a
 * null SAT as 0 (the "worst score" position) was visually misleading
 * (Codex adversarial review PR #18).
 *
 * The helper is pure (no Prisma, no React) so the skipSat branches can
 * be tested in isolation. Ordering matches the chart's clockwise layout.
 */
export function buildRadarDimensions(school: RadarSchoolInput): RadarDim[] {
  const skipSat =
    school.testPolicy === "free" ||
    school.testPolicy === "blind" ||
    school.radarSAT == null;

  return [
    { label: "录取", legendLabel: "录取友好度", value: school.radarAcceptance ?? 0 },
    { label: "国际生", legendLabel: "国际生友好度", value: school.radarInternational ?? 0 },
    ...(!skipSat
      ? [{ label: "SAT", legendLabel: "SAT 竞争力", value: school.radarSAT! }]
      : []),
    { label: "费用", legendLabel: "费用可负担度", value: school.radarCost ?? 0 },
    { label: "奖学金", legendLabel: "奖学金力度", value: school.radarAid ?? 0 },
  ];
}
