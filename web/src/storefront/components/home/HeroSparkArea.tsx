type Props = {
  series: number[];
  scaleMax: number;
  tone: "up" | "down";
  /** Stable id for SVG gradient defs (must be unique on the page). */
  gradientId: string;
  compact?: boolean;
};

const W = 120;
const H = 36;
const PAD_X = 2;
const PAD_Y = 3;

type Pt = { x: number; y: number };

function toPoints(series: number[], scaleMax: number): Pt[] {
  const max = Math.max(scaleMax, 1);
  const n = series.length;
  if (n === 0) return [{ x: 0, y: H / 2 }, { x: W, y: H / 2 }];
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const step = n > 1 ? innerW / (n - 1) : 0;
  return series.map((v, i) => ({
    x: PAD_X + i * step,
    y: PAD_Y + innerH * (1 - Math.min(Math.max(v, 0), max) / max),
  }));
}

/** Catmull-Rom → cubic Bezier smooth stroke. */
function smoothLine(pts: Pt[]): string {
  if (pts.length === 1) return `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  if (pts.length === 2) {
    return `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} L${pts[1].x.toFixed(1)} ${pts[1].y.toFixed(1)}`;
  }
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function areaFromLine(line: string, pts: Pt[]): string {
  const last = pts[pts.length - 1];
  const first = pts[0];
  const base = H - PAD_Y;
  return `${line} L${last.x.toFixed(1)} ${base} L${first.x.toFixed(1)} ${base} Z`;
}

const TONE = {
  up: { stroke: "#0EA5A4", fill: "#0EA5A4" },
  down: { stroke: "#F43F5E", fill: "#F43F5E" },
} as const;

/** Soft area sparkline — smooth curve, gradient fill, end marker. */
export function HeroSparkArea({ series, scaleMax, tone, gradientId, compact }: Props) {
  const pts = toPoints(series, scaleMax);
  const line = smoothLine(pts);
  const area = areaFromLine(line, pts);
  const end = pts[pts.length - 1];
  const c = TONE[tone];

  return (
    <svg
      className={compact ? "mt-2 h-7 w-full" : "mt-2.5 h-9 w-full"}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.fill} stopOpacity="0.32" />
          <stop offset="100%" stopColor={c.fill} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        stroke={c.stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={end.x} cy={end.y} r="4" fill={c.stroke} fillOpacity="0.16" />
      <circle cx={end.x} cy={end.y} r="2.15" fill={c.stroke} />
    </svg>
  );
}
