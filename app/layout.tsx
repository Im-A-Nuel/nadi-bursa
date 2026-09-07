import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { LanguageProvider } from '@/components/layout/LanguageProvider';
import { IHSGMarketStrip } from '@/components/common/IHSGMarketStrip';

const archivo = Archivo({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-archivo', display: 'swap' });
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Nadi Bursa - Meja Intelijen IDX',
  description: 'Skor kesehatan turunan, radar anomali, sinyal arus asing dan broker, brief 08:30 WIB. Data inti dari Sectors API v2.',
  applicationName: 'Nadi Bursa',
  openGraph: {
    title: 'Nadi Bursa - Meja Intelijen IDX',
    description: 'Skor kesehatan turunan, radar anomali, sinyal arus asing dan broker, brief 08:30 WIB. Data inti dari Sectors API v2.',
    type: 'website',
    locale: 'id_ID',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#05070D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:border focus:border-rule-2 focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:text-white">
              Lewati ke konten utama
            </a>
            <Navbar />
            <IHSGMarketStrip />
            <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
              {children}
            </main>
            <footer className="border-t border-rule mt-10">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-[var(--faint)] text-center sm:text-left">
                  Nadi Bursa v1.0 · Bukan saran finansial. Alat informasi. Data inti: Sectors API v2.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href="/about" className="mono text-xs text-[var(--faint)] hover:text-white transition-colors">Tentang</a>
                  <span className="mono text-xs text-[var(--faint)]">·</span>
                  <a href="https://companieslogo.com/" target="_blank" rel="noreferrer" className="mono text-xs text-[var(--faint)] hover:text-white transition-colors">Logo emiten: CompaniesLogo</a>
                  <span className="mono text-xs text-[var(--faint)]">SCT-HACK-2026 / TRACK: MARKET INTELLIGENCE</span>
                </div>
              </div>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
