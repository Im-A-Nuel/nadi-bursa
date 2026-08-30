'use client';
import { MockDataBadge } from '@/components/common/MockDataBadge';
import { useLang } from '@/components/layout/LanguageProvider';

export default function AboutPage() {
  const { t } = useLang();
  return (
    <div className="animate-slide-up max-w-3xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{t('About Sinyal Hari Ini', 'Tentang Sinyal Hari Ini')}</h1>
          <p className="mt-1 text-sm text-slate-400">{t('IDX Intelligence, built for Sectors Hackathon 2026', 'Inteligensi IDX, dibuat untuk Sectors Hackathon 2026')}</p>
        </div>
        <MockDataBadge />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-2">{t('Problem', 'Masalah')}</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          {t(
            'Retail IDX investors age 20 to 45 who use Ajaib or Stockbit face information overload. They miss foreign flow shifts, broker accumulation signals, dividend trap versus health, and unusual moves until it is too late.',
            'Investor ritel IDX usia 20 sampai 45 yang memakai Ajaib atau Stockbit kebanjiran informasi. Mereka telat menangkap pergeseran arus asing, sinyal akumulasi broker, jebakan dividen versus kesehatan, dan pergerakan tidak biasa.'
          )}
        </p>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Solution', 'Solusi')}</h2>
        <p className="text-sm leading-relaxed text-slate-300 mb-3">
          {t('Sinyal Hari Ini turns raw IDX data into derived insights that you can act on:', 'Sinyal Hari Ini mengubah data mentah IDX menjadi wawasan turunan yang bisa ditindaklanjuti:')}
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            { en: 'Health Scores 0 to 100: Dividend Health, Value Quality, Liquidity', id: 'Skor Kesehatan 0 sampai 100: Kesehatan Dividen, Kualitas Valuasi, Likuiditas' },
            { en: 'Anomaly Radar: price and volume versus sector baseline', id: 'Radar Anomali: harga dan volume versus baseline sektor' },
            { en: 'Foreign Flow and Broker Accumulation signals', id: 'Sinyal Arus Asing dan Akumulasi Broker' },
            { en: 'Watchlist plus automated 08:30 WIB Daily Brief', id: 'Watchlist plus Brief Harian otomatis 08:30 WIB' },
          ].map((item) => (
            <li key={item.en} className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" />
              <span>{t(item.en, item.id)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Architecture', 'Arsitektur')}</h2>
        <div className="rounded-xl border border-white/5 bg-[#0A0F1F] p-4 font-mono text-xs leading-relaxed text-slate-300">
          <div><span className="text-cyan-400">Next.js 14</span> App Router plus Tailwind plus Recharts</div>
          <div><span className="text-cyan-400">API:</span> Sectors REST v2 with transparent mock fallback</div>
          <div><span className="text-cyan-400">Signals:</span> foreign flow plus broker divergence fusion</div>
          <div><span className="text-cyan-400">Scores:</span> 0 to 100 health per ticker</div>
          <div><span className="text-cyan-400">Brief:</span> 08:30 WIB generator plus watchlist</div>
          <div><span className="text-cyan-400">i18n:</span> ID and EN toggle</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-3">{t('Track', 'Kategori')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: 'Market Intelligence', desc: t('Primary: derived insights', 'Primer: wawasan turunan'), color: '#06B6D4' },
            { name: 'Automation', desc: t('Scheduler plus cron evidence', 'Scheduler plus bukti cron'), color: '#8B5CF6' },
            { name: 'Signals', desc: t('Classification engine', 'Mesin klasifikasi'), color: '#22C55E' },
          ].map((track) => (
            <div key={track.name} className="rounded-xl border border-white/5 bg-white/2 p-3" style={{ borderLeftColor: track.color, borderLeftWidth: 2 }}>
              <div className="text-sm font-medium text-white">{track.name}</div>
              <div className="mt-1 text-xs text-slate-400">{track.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-500/15">
        <h2 className="text-sm font-semibold text-amber-400 mb-2">{t('Disclaimer', 'Penafian')}</h2>
        <p className="text-xs leading-relaxed text-slate-400">
          {t(
            'Not financial advice. This is an information tool only. All data comes from Sectors API v2. Do your own research before deciding.',
            'Bukan saran finansial. Ini hanya alat informasi. Semua data dari Sectors API v2. Lakukan riset mandiri sebelum memutuskan.'
          )}
        </p>
      </div>
    </div>
  );
}
