'use client';
import { getHealthBand } from '@/lib/healthScores';

/* VU-style score gauge: 180° instrument arc.
   Left band (0-35) is the only red the instrument allows; needle carries the value. */
export function ScoreRing({ score, size = 56 }: { score: number; size?: number; strokeWidth?: number }) {
  const band = getHealthBand(score);
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
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
      height={size * 0.62}
      viewBox={`0 0 ${size} ${size * 0.62}`}
      role="img"
      aria-label={`Skor kesehatan ${score} dari 100`}
    >
      <path d={arc(0, 35)} stroke="rgba(255,77,94,0.55)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={arc(35, 65)} stroke="rgba(231,180,74,0.45)" strokeWidth="4" fill="none" />
      <path d={arc(65, 100)} stroke="rgba(0,214,143,0.5)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={band.color} strokeWidth="2" strokeLinecap="round"
        style={{ transition: 'all 700ms cubic-bezier(0.16,1,0.3,1)' }} />
      <circle cx={cx} cy={cy} r="2.5" fill={band.color} />
      <text x={cx} y={cy + Math.max(4, size * 0.085)} textAnchor="middle" fill={band.color} fontFamily="var(--font-plex-mono), monospace" fontWeight="700" fontSize={Math.max(11, size * 0.22)}>{score}</text>
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
