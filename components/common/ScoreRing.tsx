'use client';
import { getHealthBand } from '@/lib/healthScores';

export function ScoreRing({ score, size = 64, strokeWidth = 5 }: { score: number; size?: number; strokeWidth?: number }) {
  const band = getHealthBand(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={band.color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color: band.color }}>{score}</span>
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const band = getHealthBand(score);
  return (
    <span className="badge" style={{ backgroundColor: `${band.color}20`, color: band.color, border: `1px solid ${band.color}40` }}>
      {band.label} {score}
    </span>
  );
}
