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
  { id: 5, timestamp: '2026-08-30 08:29:30 WIB', status: 'success', type: 'Anomaly Detection', duration: '3.2s', details: 'Scan complete. 2 high-severity anomalies detected: ADRO volume spike, GOTO price drop.' },
  { id: 6, timestamp: '2026-08-29 08:30:00 WIB', status: 'success', type: 'Daily Brief Generation', duration: '11.8s', details: 'Generated brief for 10 tickers. 2 alerts triggered.' },
  { id: 7, timestamp: '2026-08-29 08:29:50 WIB', status: 'failed', type: 'Screener Data Sync', duration: '30.0s', details: 'Timeout: Sectors API v2 unreachable. Retried with mock fallback.' },
  { id: 8, timestamp: '2026-08-29 08:30:05 WIB', status: 'success', type: 'Email Brief Dispatch', duration: '2.1s', details: 'Brief sent to 3 subscribers via Mailgun.' },
  { id: 9, timestamp: '2026-08-28 08:30:00 WIB', status: 'success', type: 'Daily Brief Generation', duration: '10.5s', details: 'Generated brief for 10 tickers. 4 alerts triggered.' },
  { id: 10, timestamp: '2026-08-28 08:29:45 WIB', status: 'success', type: 'Health Score Recalc', duration: '4.7s', details: 'Dividend Health, Value Quality, Liquidity recomputed for all tickers.' },
];

export default function SchedulerPage() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const { t } = useLang();
  const statusColor = (s: string) => s === 'success' ? 'text-emerald-400' : s === 'running' ? 'text-amber-400' : 'text-red-400';
  const statusBg = (s: string) => s === 'success' ? 'bg-emerald-900/30' : s === 'running' ? 'bg-amber-900/30' : 'bg-red-900/30';

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('Scheduler Log', 'Log Penjadwal')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('Automation evidence — simulated cron runs', 'Bukti otomasi — simulasi cron berjalan')}</p>
        </div>
        <MockDataBadge forceShow />
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-gray-300 text-sm font-medium">{t('Scheduler Active', 'Penjadwal Aktif')} — 08:30 WIB daily</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            ['10', t('Runs Today', 'Berjalan Hari Ini')],
            ['9', t('Successful', 'Berhasil')],
            ['1', t('Failed (retried)', 'Gagal (diulang)')],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-white">{n}</div>
              <div className="text-gray-500 text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-gold mb-3">{t('Cron Schedule', 'Jadwal Cron')}</h3>
        <div className="bg-navy-dark/40 rounded-lg p-4 font-mono text-sm text-gray-300">
          <div className="text-gray-500 text-xs mb-2"># .github/workflows/daily-brief.yml</div>
          <div><span className="text-gold">schedule:</span></div>
          <div className="ml-2"><span className="text-gold">- cron:</span> <span className="text-emerald-400">&apos;30 0 * * 1-5&apos;</span> <span className="text-gray-500"># 08:30 WIB Mon-Fri</span></div>
          <div className="mt-2"><span className="text-gold">steps:</span></div>
          <div className="ml-2"><span className="text-gray-400">- name:</span> Generate Daily Brief</div>
          <div className="ml-4"><span className="text-gray-400">run:</span> node scripts/generate-brief.js</div>
          <div className="ml-2"><span className="text-gray-400">- name:</span> Send Email Brief</div>
          <div className="ml-4"><span className="text-gray-400">run:</span> node scripts/send-email.js</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-gold mb-3">{t('Recent Runs', 'Jalankan Terbaru')}</h3>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className={`flex items-start gap-3 rounded-lg px-4 py-3 ${statusBg(log.status)}`}>
              <span className={`text-lg mt-0.5 ${statusColor(log.status)}`}>
                {log.status === 'success' ? '\u2714' : log.status === 'running' ? '\u23F3' : '\u2716'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium text-sm">{log.type}</span>
                  <span className="text-gray-500 text-xs">{log.duration}</span>
                  <span className="text-gray-500 text-xs">{log.timestamp}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
