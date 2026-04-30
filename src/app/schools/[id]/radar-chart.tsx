"use client";

import { SIZE, CENTER, RADIUS, polarToCartesian, getAngles } from "./radar-utils";

const LEVELS = 4;

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

export interface RadarDimension {
  label: string;
  value: number;
}

export function RadarChart({
  dimensions,
}: {
  dimensions: RadarDimension[];
}) {
  const sides = dimensions.length;
  if (sides < 3) return null; // need at least 3 points for a polygon

  const angles = getAngles(sides);
  const values = dimensions.map((d) => clamp(d.value));

  // Grid polygons
  const gridPaths = Array.from({ length: LEVELS }, (_, level) => {
    const r = (RADIUS / LEVELS) * (level + 1);
    const points = angles.map((a) => polarToCartesian(a, r));
    return points.map((p) => `${p[0]},${p[1]}`).join(" ");
  });

  // Data polygon
  const dataPoints = values.map((v, i) =>
    polarToCartesian(angles[i], (v / 100) * RADIUS)
  );
  const dataPolygon = dataPoints.map((p) => `${p[0]},${p[1]}`).join(" ");

  // Axis lines
  const axisLines = angles.map((a) => polarToCartesian(a, RADIUS));

  // Labels
  const labelPoints = angles.map((a) => polarToCartesian(a, RADIUS + 18));

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[240px] mx-auto"
      role="img"
      aria-label="学校画像雷达图"
    >
      {/* Grid */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="var(--color-border, #E8E0D0)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {axisLines.map(([x, y], i) => (
        <line
          key={i}
          x1={CENTER}
          y1={CENTER}
          x2={x}
          y2={y}
          stroke="var(--color-border, #E8E0D0)"
          strokeWidth="1"
        />
      ))}

      {/* Data area */}
      <polygon
        points={dataPolygon}
        fill="var(--color-primary, #2D6A4F)"
        fillOpacity="0.2"
        stroke="var(--color-primary, #2D6A4F)"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="var(--color-primary, #2D6A4F)"
        />
      ))}

      {/* Labels */}
      {labelPoints.map(([x, y], i) => (
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[9px] fill-vela-text-secondary"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {dimensions[i].label}
        </text>
      ))}
    </svg>
  );
}
