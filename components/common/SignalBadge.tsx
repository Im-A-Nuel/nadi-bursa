'use client';
import { SignalStrength, getSignalDisplay } from '@/lib/signals';

export function SignalBadge({ signal, compact }: { signal: SignalStrength; compact?: boolean }) {
  const { label, bg, text } = getSignalDisplay(signal);
  return (
    <span className="badge" style={{ backgroundColor: bg, color: text, border: `1px solid ${text}22` }}>
      {compact ? signal.replace('_', ' ') : label}
    </span>
  );
}
