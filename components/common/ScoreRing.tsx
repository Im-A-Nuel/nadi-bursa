'use client';
import { getHealthBand } from '@/lib/healthScores';

export function ScoreRing({ score, size = 56, strokeWidth = 4 }: { score: number; size?: number; strokeWidth?: number }) {
  const band = getHealthBand(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label={`Score ${score}`}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={band.color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 700ms ease-out' }} />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color: band.color }}>{score}</span>
    </div>
  );
}

export function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const band = getHealthBand(score);
  return (
    <span className="badge text-xs" style={{ backgroundColor: `${band.color}14`, color: band.color, border: `1px solid ${band.color}22` }}>
      {label ?? band.label} {score}
    </span>
  );
}
