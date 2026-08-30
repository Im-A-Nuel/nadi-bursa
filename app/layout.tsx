import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { LanguageProvider } from '@/components/layout/LanguageProvider';

export const metadata: Metadata = {
  title: 'Sinyal Hari Ini - IDX Market Intelligence',
  description: 'IDX market intelligence for retail investors. Health scores, anomaly radar, foreign flow and broker signals, daily brief 08:30 WIB. Powered by Sectors API v2.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
              {children}
            </main>
            <footer className="border-t border-white/5 mt-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500 text-center sm:text-left">
                  Sinyal Hari Ini v1.0 - Not financial advice. Information tool only. Data from Sectors API v2.
                </p>
                <p className="text-xs text-slate-600">
                  Track: Market Intelligence • Built for Sectors Hackathon 2026
                </p>
              </div>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
