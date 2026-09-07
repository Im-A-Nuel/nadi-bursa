'use client';

import Link from 'next/link';
import { isMockMode } from '@/lib/sectors/client';
import { TickerTape } from '@/components/common/TickerTape';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { Link000 } from '@/components/ui/skiper40';
import { useLang } from '@/components/layout/LanguageProvider';

const candleHeights = [19, 28, 17, 36, 24, 43, 31, 24, 48, 34, 30, 53, 42, 29, 37, 50, 32, 24, 44, 57, 39, 28, 46, 34, 52, 42, 31, 48, 60, 44, 35, 54, 40, 28, 47, 38, 55, 45];

function MarketArtwork() {
  return (
    <div className="hero-art" aria-label="Ilustrasi signal map pasar IDX">
      <div className="hero-art-grid" aria-hidden="true" />
      <div className="hero-art-caption">
        <span>IDX / SIGNAL MAP</span>
        <span>PRE-OPEN / 08:30 WIB</span>
      </div>
      <svg className="hero-art-chart" viewBox="0 0 800 350" fill="none" role="img" aria-label="Grafik ilustrasi pergerakan sinyal pasar">
        <defs>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7FF4C5" stopOpacity="0.1" />
            <stop offset="0.45" stopColor="#00D68F" />
            <stop offset="1" stopColor="#B5FFDA" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00D68F" stopOpacity="0.24" />
            <stop offset="1" stopColor="#00D68F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 294 C48 288 52 246 96 256 S132 292 164 270 S215 218 247 244 S287 224 320 252 S355 282 382 236 S421 154 451 190 S486 236 515 192 S553 122 584 151 S620 196 650 146 S706 106 800 42 L800 350 L0 350Z" fill="url(#chartFill)" />
        <path d="M0 294 C48 288 52 246 96 256 S132 292 164 270 S215 218 247 244 S287 224 320 252 S355 282 382 236 S421 154 451 190 S486 236 515 192 S553 122 584 151 S620 196 650 146 S706 106 800 42" stroke="url(#chartLine)" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 318 C80 308 140 305 215 289 S360 304 430 278 S570 260 650 218 S744 214 800 196" stroke="#405166" strokeWidth="1" strokeDasharray="5 8" opacity="0.8" />
        <line x1="584" y1="54" x2="584" y2="330" stroke="#00D68F" strokeOpacity="0.25" strokeDasharray="4 8" />
        <circle cx="584" cy="151" r="6" fill="#00D68F" />
        <circle cx="584" cy="151" r="15" stroke="#00D68F" strokeOpacity="0.35" />
      </svg>
      <div className="hero-art-glow" aria-hidden="true" />
      <div className="hero-readout">
        <div className="mono text-[10px] text-[var(--faint)]">SIGNAL CONFIDENCE</div>
        <div className="mono mt-1 text-lg font-semibold text-white">84<span className="text-xs text-[var(--muted)]"> / 100</span></div>
        <div className="mono text-[10px] text-mint mt-0.5">ACCUMULATION</div>
      </div>
      <div className="hero-candle-field" aria-hidden="true">
        {candleHeights.map((height, index) => (
          <span key={index} className="hero-candle" style={{ '--candle-height': `${height}px`, '--candle-color': index % 5 === 0 || index % 7 === 0 ? '#00D68F' : '#273447' } as React.CSSProperties} />
        ))}
      </div>
      <div className="hero-art-footer">
        <span>derived signal / demo feed</span>
        <span className="text-mint">● watchlist ready</span>
      </div>
    </div>
  );
}

type SignalCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  kind: 'scores' | 'flow' | 'radar' | 'brief';
};

function SignalCard({ href, eyebrow, title, body, kind }: SignalCardProps) {
  return (
    <Link href={href} className="signal-card group">
      <div className={`signal-card-art signal-card-art-${kind}`}>
        {kind === 'scores' && (
          <svg viewBox="0 0 600 300" fill="none" aria-hidden="true">
            <text x="44" y="42" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.2">HEALTH SCORE / DEMO FEED</text>
            <path d="M44 62H556" stroke="#263242" />
            <text x="44" y="94" fill="#E8ECF4" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="600">BBCA</text>
            <text x="132" y="94" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">DIVIDEND</text>
            <rect x="210" y="86" width="170" height="5" rx="2.5" fill="#263242" /><rect x="210" y="86" width="148" height="5" rx="2.5" fill="#00D68F" />
            <text x="402" y="94" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono">87</text>
            <text x="44" y="138" fill="#E8ECF4" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="600">BMRI</text>
            <text x="132" y="138" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">VALUE</text>
            <rect x="210" y="130" width="170" height="5" rx="2.5" fill="#263242" /><rect x="210" y="130" width="128" height="5" rx="2.5" fill="#E7B44A" />
            <text x="402" y="138" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono">75</text>
            <text x="44" y="182" fill="#E8ECF4" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="600">ADRO</text>
            <text x="132" y="182" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">LIQUIDITY</text>
            <rect x="210" y="174" width="170" height="5" rx="2.5" fill="#263242" /><rect x="210" y="174" width="142" height="5" rx="2.5" fill="#00D68F" />
            <text x="402" y="182" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono">83</text>
            <path d="M44 222H556" stroke="#263242" />
            <text x="44" y="248" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">OVERALL</text>
            <text x="106" y="250" fill="#00D68F" fontSize="19" fontFamily="IBM Plex Mono" fontWeight="600">83</text>
            <text x="145" y="248" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">/ 100</text>
            <text x="476" y="248" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">3 SIGNALS</text>
          </svg>
        )}
        {kind === 'flow' && (
          <svg viewBox="0 0 600 300" fill="none" aria-hidden="true">
            <text x="44" y="42" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.2">CAPITAL FLOW / 20 SESSIONS</text>
            <path d="M44 70H556M44 122H556M44 174H556M44 226H556" stroke="#263242" />
            <path d="M44 190 C82 174 97 134 132 149 S177 193 218 168 S265 126 304 148 S344 177 380 132 S429 91 466 113 S512 151 556 99" stroke="#00D68F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M44 208 C84 196 101 170 134 181 S180 211 220 190 S265 158 304 174 S350 192 381 163 S425 139 465 151 S512 178 556 144" stroke="#E7B44A" strokeWidth="1.5" strokeDasharray="5 7" />
            <line x1="466" y1="76" x2="466" y2="226" stroke="#00D68F" strokeOpacity=".35" strokeDasharray="4 6" />
            <circle cx="466" cy="113" r="5" fill="#00D68F" />
            <rect x="44" y="244" width="10" height="3" rx="1.5" fill="#00D68F" /><text x="62" y="248" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">FOREIGN +</text>
            <rect x="150" y="244" width="10" height="3" rx="1.5" fill="#E7B44A" /><text x="168" y="248" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">BROKER</text>
            <text x="472" y="248" fill="#00D68F" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">ACCUMULATION</text>
          </svg>
        )}
        {kind === 'radar' && (
          <svg viewBox="0 0 600 300" fill="none" aria-hidden="true">
            <text x="44" y="42" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.2">ANOMALY RADAR / SECTOR RELATIVE</text>
            <path d="M44 64H556" stroke="#263242" />
            <text x="44" y="90" fill="#7B879E" fontSize="9" fontFamily="IBM Plex Mono">SEVERITY</text><text x="150" y="90" fill="#7B879E" fontSize="9" fontFamily="IBM Plex Mono">TICKER</text><text x="240" y="90" fill="#7B879E" fontSize="9" fontFamily="IBM Plex Mono">READING</text><text x="492" y="90" fill="#7B879E" fontSize="9" fontFamily="IBM Plex Mono">DEVIATION</text>
            <path d="M44 105H556M44 155H556M44 205H556M44 255H556" stroke="#263242" />
            <circle cx="59" cy="130" r="4" fill="#FF4D5E" /><text x="74" y="134" fill="#FF8A96" fontSize="10" fontFamily="IBM Plex Mono">HIGH</text>
            <text x="150" y="134" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">ADRO</text><text x="240" y="134" fill="#E8ECF4" fontSize="10" fontFamily="IBM Plex Mono">VOLUME SPIKE</text><text x="492" y="134" fill="#FF8A96" fontSize="10" fontFamily="IBM Plex Mono">x2.8</text>
            <circle cx="59" cy="180" r="4" fill="#FF4D5E" /><text x="74" y="184" fill="#FF8A96" fontSize="10" fontFamily="IBM Plex Mono">HIGH</text>
            <text x="150" y="184" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">GOTO</text><text x="240" y="184" fill="#E8ECF4" fontSize="10" fontFamily="IBM Plex Mono">PRICE DIVERGE</text><text x="492" y="184" fill="#FF8A96" fontSize="10" fontFamily="IBM Plex Mono">-4.2%</text>
            <circle cx="59" cy="230" r="4" fill="#E7B44A" /><text x="74" y="234" fill="#E7B44A" fontSize="10" fontFamily="IBM Plex Mono">MED</text>
            <text x="150" y="234" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">BBRI</text><text x="240" y="234" fill="#E8ECF4" fontSize="10" fontFamily="IBM Plex Mono">FLOW DRIFT</text><text x="492" y="234" fill="#E7B44A" fontSize="10" fontFamily="IBM Plex Mono">3d</text>
          </svg>
        )}
        {kind === 'brief' && (
          <svg viewBox="0 0 600 300" fill="none" aria-hidden="true">
            <text x="44" y="42" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.2">WATCHLIST / PRE-OPEN BRIEF</text>
            <rect x="44" y="66" width="512" height="178" rx="6" fill="#111922" stroke="#2A554D" />
            <path d="M44 108H556" stroke="#263242" />
            <text x="68" y="94" fill="#E7B44A" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">08:30 WIB</text>
            <text x="472" y="94" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">MON-FRI</text>
            <text x="70" y="133" fill="#E8ECF4" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">WATCHLIST SIGNALS</text>
            <text x="70" y="160" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">BBCA</text><path d="M130 157H342" stroke="#263242" strokeWidth="4" strokeLinecap="round" /><path d="M130 157H288" stroke="#00D68F" strokeWidth="4" strokeLinecap="round" /><text x="382" y="160" fill="#00D68F" fontSize="10" fontFamily="IBM Plex Mono">HEALTHY</text>
            <text x="70" y="190" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">ADRO</text><path d="M130 187H342" stroke="#263242" strokeWidth="4" strokeLinecap="round" /><path d="M130 187H256" stroke="#E7B44A" strokeWidth="4" strokeLinecap="round" /><text x="382" y="190" fill="#E7B44A" fontSize="10" fontFamily="IBM Plex Mono">WATCH</text>
            <text x="70" y="220" fill="#7B879E" fontSize="10" fontFamily="IBM Plex Mono">GOTO</text><path d="M130 217H342" stroke="#263242" strokeWidth="4" strokeLinecap="round" /><path d="M130 217H205" stroke="#FF4D5E" strokeWidth="4" strokeLinecap="round" /><text x="382" y="220" fill="#FF8A96" fontSize="10" fontFamily="IBM Plex Mono">ANOMALY</text>
          </svg>
        )}
      </div>
      <div className="signal-card-copy">
        <div className="mono text-[10px] tracking-[0.12em] text-[var(--faint)]">{eyebrow}</div>
        <h3 className="mt-3 font-display text-xl sm:text-2xl font-semibold tracking-tight text-white group-hover:text-mint transition-colors">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
        <span className="mt-auto pt-5 mono text-[10px] uppercase tracking-widest text-gold">{kind === 'brief' ? 'OPEN BRIEF' : 'OPEN MODULE'} →</span>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const { t } = useLang();

  return (
    <div className="landing-stage -mx-4 sm:-mx-6 -mt-6 sm:-mt-10 px-4 sm:px-6">
      <section className="landing-hero mx-auto max-w-6xl pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="landing-hero-copy">
          <div className="hero-kicker">
            <span className="led led-on" aria-hidden="true" />
            <span className="mono">NADI BURSA / PRE-OPEN DESK</span>
          </div>
          <p className="mono mt-7 text-[11px] tracking-[0.14em] text-gold">IDX MARKET INTELLIGENCE</p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold leading-[0.96] tracking-[-0.05em] text-white">
            {t('Read the market pulse before the bell.', 'Baca denyut pasar sebelum bel terbuka.')}
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
            {t('Health scores, capital flow and anomaly radar, distilled from Sectors data into a ranked pre-open read.', 'Skor kesehatan, arus modal, dan radar anomali diringkas dari data Sectors menjadi bacaan terurut sebelum pasar buka.')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary">{t('Open the desk', 'Buka Dasbor')}</Link>
            <Link href="/brief" className="btn-line">{t('Read today brief', 'Baca brief hari ini')}</Link>
          </div>
          <div className="hero-proof mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--faint)]">
            <span><b>10</b> IDX emiten</span>
            <span><b>9</b> Sectors v2 endpoints</span>
            <span>{t('No trading execution', 'Tanpa eksekusi trading')}</span>
          </div>
        </div>

        <div className="landing-hero-art">
          <MarketArtwork />
          <div className="hero-art-note mono" aria-hidden="true">
            <span>MARKET PULSE</span>
            <span>ONE READ / 08:30</span>
          </div>
        </div>

        <div className="landing-hero-status flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--faint)]">
          <span className="inline-flex items-center gap-1.5"><span className="led led-on" /> {t('Market intelligence', 'Inteligensi pasar')}</span>
          <span className="inline-flex items-center gap-1.5"><span className="led led-warn" /> {isMockMode() ? t('Demo feed, works offline', 'Feed demo, jalan offline') : 'Sectors v2 connected'}</span>
          <span className="mono">Not financial advice</span>
        </div>
      </section>

      <section className="landing-band">
        <TickerTape />
      </section>

      <ScrollReveal className="mx-auto max-w-6xl">
        <section className="py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="field-label">THE MORNING READ</div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-tight text-white">{t('A quiet layer between raw data and your next decision.', 'Lapisan tenang antara data mentah dan keputusan berikutnya.')}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">{t('Nadi Bursa does not add another noisy screen. It turns the data you already need into a short, ranked read.', 'Nadi Bursa bukan layar bising tambahan. Kami mengubah data yang memang kamu butuhkan menjadi bacaan singkat dan terurut.')}</p>
            <Link000 href="/about" className="mt-6 mono text-xs text-gold hover:text-white transition-colors">{t('See the method', 'Lihat metodenya')} →</Link000>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {[
              { code: '01', title: t('Health, in one read', 'Kesehatan, dalam satu bacaan'), body: t('Dividend sustainability, value quality and liquidity condensed into a 0 to 100 score per ticker.', 'Keberlanjutan dividen, kualitas valuasi dan likuiditas diringkas jadi skor 0 sampai 100 per ticker.'), color: 'mint' },
              { code: '02', title: t('Flow, with context', 'Arus, dengan konteks'), body: t('Foreign inflow and broker divergence are fused so a price move has a reason beside it.', 'Arus asing dan divergensi broker digabung supaya setiap gerak harga punya konteks.'), color: 'gold' },
              { code: '03', title: t('Anomalies, before noise', 'Anomali, sebelum ramai'), body: t('Price and volume are compared to a sector baseline, not a generic market average.', 'Harga dan volume dibandingkan dengan baseline sektor, bukan rata-rata pasar generik.'), color: 'coral' },
            ].map((item) => (
              <div key={item.code} className="landing-feature p-5 sm:p-7">
                <div className="feature-rail" aria-hidden="true" />
                <div className="mono text-xs text-[var(--faint)]">{item.code} / SIGNAL</div>
                <h3 className="mt-7 max-w-md font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                <span className={`mt-7 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-widest ${item.color === 'mint' ? 'text-mint' : item.color === 'gold' ? 'text-gold' : 'text-coral'}`}><span className={`led ${item.color === 'mint' ? 'led-on' : item.color === 'gold' ? 'led-warn' : 'led-fail'}`} /> derived output</span>
              </div>
            ))}
          </div>
        </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-6xl" delay={70}>
        <section className="pb-16 sm:pb-24">
        <div className="mb-7 max-w-2xl">
          <div className="field-label text-mint">THE DESK, AT A GLANCE</div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">{t('A complete read of the market, in four instruments.', 'Bacaan lengkap pasar, dalam empat instrumen.')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{t('Each module answers one question before the opening bell. Open the one you need.', 'Setiap modul menjawab satu pertanyaan sebelum bel pembukaan. Buka yang kamu butuhkan.')}</p>
        </div>
        <div className="signal-grid">
          <SignalCard
            href="/dashboard"
            eyebrow="01 / HEALTH SCORES"
            title={t('Which names are actually healthy?', 'Emiten mana yang benar-benar sehat?')}
            body={t('Three derived instruments turn fundamentals into one readable score per ticker.', 'Tiga instrumen turunan mengubah fundamental menjadi satu skor yang mudah dibaca per ticker.')}
            kind="scores"
          />
          <SignalCard
            href="/ticker/BBCA"
            eyebrow="02 / CAPITAL FLOW"
            title={t('Who is moving the price?', 'Siapa yang menggerakkan harga?')}
            body={t('Foreign flow and broker activity meet in one signal with a clear confidence read.', 'Arus asing dan aktivitas broker bertemu dalam satu sinyal dengan keyakinan yang jelas.')}
            kind="flow"
          />
          <SignalCard
            href="/radar"
            eyebrow="03 / ANOMALY RADAR"
            title={t('What does not belong in the baseline?', 'Apa yang menyimpang dari baseline?')}
            body={t('Sector-relative detection catches price and volume behavior before it becomes market noise.', 'Deteksi relatif sektor menangkap perilaku harga dan volume sebelum berubah menjadi kebisingan pasar.')}
            kind="radar"
          />
          <SignalCard
            href="/brief"
            eyebrow="04 / MORNING BRIEF"
            title={t('What should I know at 08:30?', 'Apa yang perlu diketahui pukul 08:30?')}
            body={t('Your watchlist, ranked signals and alerts arrive as one calm pre-open briefing.', 'Watchlist, sinyal terurut dan alert hadir sebagai satu briefing tenang sebelum pasar buka.')}
            kind="brief"
          />
        </div>
        </section>
      </ScrollReveal>

      <ScrollReveal className="mx-auto max-w-6xl" delay={110}>
        <section className="pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/12 via-panel to-panel p-7 sm:p-12 text-center">
          <div className="absolute inset-x-1/4 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
          <div className="field-label text-gold">BEFORE THE BELL</div>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl sm:text-5xl font-bold leading-tight tracking-[-0.04em] text-white">{t('Start with the signal, not the noise.', 'Mulai dari sinyal, bukan kebisingan.')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{t('Open the working desk, inspect a ticker, then make your own call. The app never places an order for you.', 'Buka meja kerja, periksa ticker, lalu buat keputusanmu sendiri. Aplikasi ini tidak pernah menempatkan order.')}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/dashboard" className="btn-primary">Buka Dasbor</Link><Link href="/screener" className="btn-line">Saring Emiten</Link></div>
          <p className="mt-6 text-xs text-[var(--faint)]">Not financial advice. Information tool only.</p>
        </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
