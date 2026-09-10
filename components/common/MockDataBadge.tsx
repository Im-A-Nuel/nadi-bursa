'use client';
import { getDataSource } from '@/lib/sectors/client';

export function MockDataBadge({ forceShow }: { forceShow?: boolean }) {
  const source = getDataSource();
  const isLive = source.source === 'live';
  const updatedAt = source.fetchedAt ? new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(new Date(source.fetchedAt)) : null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${isLive ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" />
      {isLive ? 'LIVE SECTORS' : forceShow ? 'DEMO SCHEDULE' : 'DEMO DATA'}{updatedAt ? ` · ${updatedAt} WIB` : ''}
    </span>
  );
}
