'use client';
import { getHealthBand } from '@/lib/healthScores';

/* VU-style score gauge: 180° instrument arc.
   Left band (0-35) is the only red the instrument allows; needle carries the value. */
export function ScoreRing({ score, size = 56, strokeWidth = 4 }: { score: number; size?: number; strokeWidth?: number }) {
  const band = getHealthBand(score);
  const r = size / 2 - strokeWidth - 3;
  const cx = size / 2;
  const cy = size * 0.6;
  const arc = (from: number, to: number) => {
    const a0 = Math.PI - (from / 100) * Math.PI;
    const a1 = Math.PI - (to / 100) * Math.PI;
    const x0 = cx + r * Math.cos(a1);
    const y0 = cy - r * Math.sin(a1);
    const x1 = cx + r * Math.cos(a0);
    const y1 = cy - r * Math.sin(a0);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const needleAngle = Math.PI - (score / 100) * Math.PI;
  const nx = cx + (r - 4) * Math.cos(needleAngle);
  const ny = cy - (r - 4) * Math.sin(needleAngle);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Skor kesehatan ${score} dari 100`}
    >
      <path d={arc(0, 35)} stroke="rgba(255,77,94,0.55)" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
      <path d={arc(35, 65)} stroke="rgba(231,180,74,0.45)" strokeWidth={strokeWidth} fill="none" />
      <path d={arc(65, 100)} stroke="rgba(0,214,143,0.5)" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={band.color} strokeWidth={Math.max(2, strokeWidth * 0.55)} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={Math.max(2.5, strokeWidth * 0.65)} fill={band.color} />
      <text x={cx} y={size - 4} textAnchor="middle" fill={band.color} fontFamily="var(--font-plex-mono), monospace" fontWeight="700" fontSize={Math.max(11, size * 0.22)}>{score}</text>
    </svg>
  );
}

export function ScoreValue({ score }: { score: number }) {
  const band = getHealthBand(score);
  return <span className="num font-semibold" style={{ color: band.color }}>{score}</span>;
}

export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const band = getHealthBand(score);
  return (
    <span className="badge" style={{ backgroundColor: `${band.color}12`, color: band.color, borderColor: `${band.color}30` }}>
      {label ?? band.label} {score}
    </span>
  );
}
