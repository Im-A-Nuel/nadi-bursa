'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './LanguageProvider';

function BrandMark() {
  return (
    <span className="grid h-8 w-8 place-items-center" aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
        <rect width="64" height="64" rx="16" fill="#E7B44A" />
        <path d="M13 38.5C18 38.5 19.5 28 26 28s7 7 12 7 7.5-12 13-12" stroke="#05070D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <path d="M13 47h38" stroke="#05070D" strokeLinecap="round" strokeOpacity=".3" strokeWidth="2" />
        <circle cx="51" cy="23" r="4" fill="#00D68F" stroke="#05070D" strokeWidth="2" />
      </svg>
    </span>
  );
}

function MenuIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>;
}

const NAV_ITEMS = [
  { href: '/', labelEn: 'Home', labelId: 'Beranda' },
  { href: '/dashboard', labelEn: 'Dashboard', labelId: 'Dasbor' },
  { href: '/screener', labelEn: 'Screener', labelId: 'Saringan' },
  { href: '/radar', labelEn: 'Radar', labelId: 'Radar' },
  { href: '/brief', labelEn: 'Brief', labelId: 'Brief' },
  { href: '/scheduler', labelEn: 'Scheduler', labelId: 'Penjadwal' },
];

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggle, t } = useLang();

  return (
    <nav className="sticky top-0 z-50 px-1 sm:px-2">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" aria-hidden="true" />
      <div className="border-b border-rule bg-ink/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Nadi Bursa home">
            <BrandMark />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-[-0.02em] text-white">NADI BURSA</span>
              <span className="mono mt-1 text-[9px] tracking-[0.08em] text-[var(--faint)]">IDX MARKET INTELLIGENCE</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${active ? 'bg-mint/10 text-mint' : 'text-[var(--muted)] hover:bg-white/[0.04] hover:text-white'}`}
                >
                  {t(item.labelEn, item.labelId)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label="Ganti bahasa" className="mono inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-rule px-2.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-rule-2 hover:text-white">
              {lang === 'en' ? 'ID' : 'EN'}
            </button>
            <Link href="/dashboard" className="hidden min-h-10 items-center justify-center rounded-md bg-mint px-4 text-xs font-semibold text-ink transition-colors hover:bg-[#2DE8A5] sm:inline-flex">
              {t('Open desk', 'Buka dasbor')}
            </Link>
            <div className="lg:hidden">
              <details className="group relative">
                <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-md border border-rule text-[var(--muted)] transition-colors hover:border-rule-2 hover:text-white" aria-label="Buka menu">
                  <MenuIcon />
                </summary>
                <div className="absolute right-0 top-12 z-50 w-56 rounded-md border border-rule bg-panel p-1.5 shadow-2xl">
                  {NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={(e) => { const d = (e.currentTarget as HTMLElement).closest('details'); if (d) d.removeAttribute('open'); }} className={`block rounded px-3 py-2.5 text-sm transition-colors ${active ? 'bg-mint/10 text-mint' : 'text-[var(--muted)] hover:bg-white/[0.04] hover:text-white'}`}>
                        {t(item.labelEn, item.labelId)}
                      </Link>
                    );
                  })}
                  <Link href="/dashboard" onClick={(e) => { const d = (e.currentTarget as HTMLElement).closest('details'); if (d) d.removeAttribute('open'); }} className="mt-1 block rounded bg-mint px-3 py-2.5 text-center text-sm font-semibold text-ink">
                    {t('Open desk', 'Buka dasbor')}
                  </Link>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
