'use client';
import { useState } from 'react';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

type LogEntry = {
  id: number;
  timestamp: string;
  status: 'success' | 'running' | 'failed';
  type: string;
  duration: string;
  details: string;
};

const MOCK_LOGS: LogEntry[] = [
  { id: 1, timestamp: '2026-08-30 08:30:00 WIB', status: 'success', type: 'Daily Brief Generation', duration: '12.4s', details: 'Generated brief for 10 tickers. 3 alerts triggered. Watchlist: BBCA, BBRI, TLKM.' },
  { id: 2, timestamp: '2026-08-30 08:30:15 WIB', status: 'success', type: 'Screener Data Sync', duration: '8.2s', details: 'Fetched 10 tickers from Sectors API v2. Cache refreshed.' },
  { id: 3, timestamp: '2026-08-30 08:29:55 WIB', status: 'success', type: 'Foreign Flow Update', duration: '5.1s', details: 'Updated foreign flow for all tracked symbols.' },
  { id: 4, timestamp: '2026-08-30 08:29:40 WIB', status: 'success', type: 'Broker Summary Sync', duration: '6.8s', details: 'Broker divergence computed for 10 tickers.' },
  { id: 5, timestamp: '2026-08-30 08:29:30 WIB', status: 'success', type: 'Anomaly Detection', duration: '3.2s', details: 'Scan complete. 2 high severity anomalies detected: ADRO volume spike, GOTO price drop.' },
  { id: 6, timestamp: '2026-08-29 08:30:00 WIB', status: 'success', type: 'Daily Brief Generation', duration: '11.8s', details: 'Generated brief for 10 tickers. 2 alerts triggered.' },
  { id: 7, timestamp: '2026-08-29 08:29:50 WIB', status: 'failed', type: 'Screener Data Sync', duration: '30.0s', details: 'Timeout: Sectors API v2 unreachable. Retried with mock fallback.' },
  { id: 8, timestamp: '2026-08-29 08:30:05 WIB', status: 'success', type: 'Email Brief Dispatch', duration: '2.1s', details: 'Brief sent to 3 subscribers.' },
  { id: 9, timestamp: '2026-08-28 08:30:00 WIB', status: 'success', type: 'Daily Brief Generation', duration: '10.5s', details: 'Generated brief for 10 tickers. 4 alerts triggered.' },
  { id: 10, timestamp: '2026-08-28 08:29:45 WIB', status: 'success', type: 'Health Score Recalc', duration: '4.7s', details: 'Dividend Health, Value Quality, Liquidity recomputed for all tickers.' },
];

export default function SchedulerPage() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const { t } = useLang();

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('Scheduler Log', 'Log Penjadwal')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('Automation evidence, simulated cron runs', 'Bukti otomasi, simulasi cron berjalan')}</p>
        </div>
        <MockDataBadge forceShow />
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-soft-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-200">{t('Scheduler Active', 'Penjadwal Aktif')} - 08:30 WIB daily</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            ['10', t('Runs Today', 'Berjalan Hari Ini')],
            ['9', t('Successful', 'Berhasil')],
            ['1', t('Failed (retried)', 'Gagal (diulang)')],
          ].map(([n, label]) => (
            <div key={label}>
              <div className="text-2xl font-bold tabular-nums text-white">{n}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Cron Schedule', 'Jadwal Cron')}</h2>
        <div className="rounded-xl border border-white/5 bg-[#0A0F1F] p-4 font-mono text-xs leading-relaxed">
          <div className="text-slate-500"># .github/workflows/daily-brief.yml</div>
          <div className="mt-2"><span className="text-cyan-400">schedule:</span></div>
          <div className="ml-3"><span className="text-cyan-400">- cron:</span> <span className="text-emerald-400">'30 0 * * 1-5'</span> <span className="text-slate-500"># 08:30 WIB Mon-Fri</span></div>
          <div className="mt-3"><span className="text-cyan-400">steps:</span></div>
          <div className="ml-3 text-slate-300">- name: Generate Daily Brief</div>
          <div className="ml-6 text-slate-500">run: node scripts/generate-brief.js</div>
          <div className="ml-3 text-slate-300">- name: Send Email Brief</div>
          <div className="ml-6 text-slate-500">run: node scripts/send-email.js</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Recent Runs', 'Jalankan Terbaru')}</h2>
        <div className="space-y-2">
          {logs.map((log) => {
            const isOk = log.status === 'success';
            const isFail = log.status === 'failed';
            return (
              <div key={log.id} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${isOk ? 'border-emerald-500/15 bg-emerald-500/8' : isFail ? 'border-red-500/15 bg-red-500/8' : 'border-amber-500/15 bg-amber-500/8'}`}>
                <span className={`mt-0.5 w-6 h-6 rounded-full grid place-items-center text-xs font-bold shrink-0 ${isOk ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : isFail ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`} aria-hidden="true">
                  {isOk ? '✓' : isFail ? '×' : '•'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-white">{log.type}</span>
                    <span className="text-xs tabular-nums text-slate-500">{log.duration}</span>
                    <span className="text-xs text-slate-600">{log.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{log.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
