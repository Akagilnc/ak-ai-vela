"use client";

const LABELS = ["Acceptance", "International", "SAT", "Affordability", "Aid"];
const SIDES = 5;
const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 90;
const LEVELS = 4;

function polarToCartesian(
  angle: number,
  radius: number
): [number, number] {
  // Start from top (-90°), go clockwise
  const rad = ((angle - 90) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

function getAngles(): number[] {
  return Array.from({ length: SIDES }, (_, i) => (360 / SIDES) * i);
}

export function RadarChart({
  data,
}: {
  data: {
    acceptance: number;
    international: number;
    sat: number;
    cost: number;
    aid: number;
  };
}) {
  const angles = getAngles();
  const values = [
    data.acceptance,
    data.international,
    data.sat,
    data.cost,
    data.aid,
  ];

  // Grid circles
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
      aria-label="School profile radar chart"
    >
      {/* Grid */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E8E0D0"
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
          stroke="#E8E0D0"
          strokeWidth="1"
        />
      ))}

      {/* Data area */}
      <polygon
        points={dataPolygon}
        fill="#2D6A4F"
        fillOpacity="0.2"
        stroke="#2D6A4F"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill="#2D6A4F"
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
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {LABELS[i]}
        </text>
      ))}
    </svg>
  );
}
