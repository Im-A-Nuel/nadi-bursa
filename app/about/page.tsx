'use client';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

export default function AboutPage() {
  const { t } = useLang();
  return (
    <div className="animate-slide-up max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('About Sinyal Hari Ini', 'Tentang Sinyal Hari Ini')}</h1>
        <MockDataBadge />
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gold mb-3">{t('Problem', 'Masalah')}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          {t(
            'Indonesian retail IDX investors (age 20-45, using Ajaib/Stockbit) face information overload. They miss foreign flow shifts, broker accumulation signals, dividend trap vs health, and unusual moves until too late.',
            'Investor ritail Indonesia di IDX (usia 20-45, menggunakan Ajaib/Stockbit) menghadapi informasi berlebihan. Mereka kehilangan pergeseran arus asing, sinyal akumulasi broker, jebakan dividen vs kesehatan, dan pergerakan tidak biasa sampai terlambat.'
          )}
        </p>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gold mb-3">{t('Solution', 'Solusi')}</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">
          {t(
            'Sinyal Hari Ini translates raw IDX data into derived insights:',
            'Sinyal Hari Ini menerjemahkan data mentah IDX menjadi wawasan turunan:'
          )}
        </p>
        <ul className="space-y-2 text-gray-300 text-sm">
          {[
            { en: 'Health Scores (0-100): Dividend Health, Value Quality, Liquidity', id: 'Skor Kesehatan (0-100): Kesehatan Dividen, Kualitas Nilai, Likuiditas' },
            { en: 'Anomaly Radar: unusual price/volume vs sector baseline', id: 'Radar Anomali: harga/volume tidak biasa vs baseline sektor' },
            { en: 'Foreign Flow & Broker Accumulation Signals', id: 'Sinyal Arus Asing & Akumulasi Broker' },
            { en: 'Watchlist + Automated 08:30 WIB Daily Brief', id: 'Watchlist + Rangkuman Harian 08:30 WIB Otomatis' },
          ].map(item => (
            <li key={item.en} className="flex items-start gap-2">
              <span className="text-teal mt-0.5">{'\u25B8'}</span>
              <span>{t(item.en, item.id)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gold mb-3">{t('Architecture', 'Arsitektur')}</h2>
        <div className="bg-navy-dark/40 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-1">
          <div><span className="text-gold">Next.js 14</span> App Router + Tailwind + Recharts</div>
          <div><span className="text-gold">API Layer</span>: Sectors REST API v2 with transparent mock fallback</div>
          <div><span className="text-gold">Signals</span>: Derived foreign flow + broker divergence analysis</div>
          <div><span className="text-gold">Scores</span>: 0-100 health scoring per ticker</div>
          <div><span className="text-gold">Brief</span>: Automated 08:30 WIB morning briefing generator</div>
          <div><span className="text-gold">i18n</span>: Indonesian/English language toggle</div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gold mb-3">{t('Tracks', 'Kategori')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'Market Intelligence', desc: t('Primary: derived insights & analytics', 'Primer: wawasan & analisis turunan'), color: '#C6A664' },
            { name: 'Automation Workflows', desc: t('Scheduler evidence & cron simulation', 'Bukti penjadwalan & simulasi cron'), color: '#8B5CF6' },
            { name: 'AI Agents & Assistants', desc: t('Signal classification engine', 'Mesin klasifikasi sinyal'), color: '#0E8074' },
          ].map(track => (
            <div key={track.name} className="bg-navy-dark/40 rounded-lg p-3 border-l-2" style={{ borderColor: track.color }}>
              <div className="text-white font-medium text-sm">{track.name}</div>
              <div className="text-gray-400 text-xs mt-1">{track.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-500/20">
        <h2 className="text-lg font-semibold text-amber-400 mb-2">{t('Disclaimer', 'Penafian')}</h2>
        <p className="text-gray-400 text-xs leading-relaxed">
          {t(
            'Not financial advice. This is an information tool only. All data comes from Sectors API v2. Always do your own research before making investment decisions.',
            'Bukan saran keuangan. Ini hanya alat informasi. Semua data berasal dari Sectors API v2. Selalu lakukan riset sendiri sebelum membuat keputusan investasi.'
          )}
        </p>
      </div>
    </div>
  );
}
