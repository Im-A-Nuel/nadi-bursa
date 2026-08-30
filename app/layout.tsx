import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { LanguageProvider } from '@/components/layout/LanguageProvider';

export const metadata: Metadata = {
  title: 'Sinyal Hari Ini — IDX Market Intelligence',
  description: 'Indonesia stock market intelligence & daily brief automation for retail IDX investors',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
              {children}
            </main>
            <footer className="text-center text-xs text-gray-500 py-4 border-t border-white/5">
              Sinyal Hari Ini v1.0 — Not financial advice. Information tool only. Data from Sectors API v2.
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
