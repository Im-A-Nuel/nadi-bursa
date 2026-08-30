'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './LanguageProvider';

type NavItem = { href: string; labelEn: string; labelId: string; icon: React.ReactNode };

function IconDashboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconRadar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12 L19 7" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
function IconScreener(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  );
}
function IconBrief(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M4 6h16v12H4z" rx="2" />
      <path d="M8 10h8M8 14h5" strokeLinecap="round" />
    </svg>
  );
}
function IconScheduler(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAbout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', labelEn: 'Home', labelId: 'Beranda', icon: <IconDashboard className="w-4 h-4" /> },
  { href: '/dashboard', labelEn: 'Dashboard', labelId: 'Dasbor', icon: <IconDashboard className="w-4 h-4" /> },
  { href: '/screener', labelEn: 'Screener', labelId: 'Saringan', icon: <IconScreener className="w-4 h-4" /> },
  { href: '/radar', labelEn: 'Radar', labelId: 'Radar', icon: <IconRadar className="w-4 h-4" /> },
  { href: '/brief', labelEn: 'Brief', labelId: 'Rangkuman', icon: <IconBrief className="w-4 h-4" /> },
  { href: '/scheduler', labelEn: 'Scheduler', labelId: 'Penjadwal', icon: <IconScheduler className="w-4 h-4" /> },
  { href: '/about', labelEn: 'About', labelId: 'Tentang', icon: <IconAbout className="w-4 h-4" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggle, t } = useLang();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 grid place-items-center text-[#020617] font-bold text-sm">S</span>
          <span className="flex flex-col leading-none">
            <span className="text-white font-semibold text-sm tracking-tight">Sinyal Hari Ini</span>
            <span className="text-slate-500 text-xs hidden sm:block">IDX Intelligence</span>
          </span>
          <span className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded text-xs font-semibold tracking-widest border border-cyan-500/20 text-cyan-400/70 uppercase">IDX</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors min-h-11 ${active ? 'bg-white/6 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                {item.icon}
                {t(item.labelEn, item.labelId)}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle language" className="btn-outline px-3 py-2 text-xs min-h-9">
            {lang === 'en' ? 'ID' : 'EN'}
          </button>
          <div className="lg:hidden">
            <details className="group relative">
              <summary className="list-none cursor-pointer w-9 h-9 grid place-items-center rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors" aria-label="Open menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
              </summary>
              <div className="absolute right-0 top-11 w-56 rounded-2xl border border-white/10 bg-[#0E1223] shadow-2xl p-2 z-50">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${active ? 'bg-white/6 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                      {item.icon}
                      {t(item.labelEn, item.labelId)}
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
