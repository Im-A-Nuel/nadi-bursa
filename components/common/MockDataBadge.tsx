'use client';
import { isMockMode } from '@/lib/sectors/client';

export function MockDataBadge({ forceShow }: { forceShow?: boolean }) {
  if (!forceShow && !isMockMode()) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-900/40 border border-amber-700/30 text-amber-300 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Demo Mode — Mock Data
    </span>
  );
}
