export const SIDES = 5;
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

export function getAngles(): number[] {
  return Array.from({ length: SIDES }, (_, i) => (360 / SIDES) * i);
}
