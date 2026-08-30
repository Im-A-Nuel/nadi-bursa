'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from './LanguageProvider';

const NAV_ITEMS = [
  { href: '/', labelEn: 'Dashboard', labelId: 'Dasbor', icon: '\u25C9' },
  { href: '/screener', labelEn: 'Screener', labelId: 'Saringan', icon: '\u25A3' },
  { href: '/radar', labelEn: 'Radar', labelId: 'Radar', icon: '\u25CE' },
  { href: '/brief', labelEn: 'Brief', labelId: 'Rangkuman', icon: '\u2709' },
  { href: '/scheduler', labelEn: 'Scheduler', labelId: 'Penjadwal', icon: '\u23F0' },
  { href: '/about', labelEn: 'About', labelId: 'Tentang', icon: '\u2139' },
];

export function Navbar() {
  const pathname = usePathname();
  const { lang, toggle, t } = useLang();

  return (
    <nav className="sticky top-0 z-50 bg-navy-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-gold font-bold text-lg tracking-tight">Sinyal Hari Ini</span>
          <span className="hidden sm:inline text-[10px] text-gold/50 border border-gold/20 rounded px-1.5 py-0.5 uppercase tracking-widest">IDX</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-gold/15 text-gold font-medium'
                  : 'text-gray-400 hover:text-gold hover:bg-white/5'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {t(item.labelEn, item.labelId)}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="btn-outline text-xs px-2 py-1">
            {lang === 'en' ? 'ID' : 'EN'}
          </button>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function MobileMenu() {
  const pathname = usePathname();
  const { t } = useLang();
  return (
    <div className="md:hidden">
      <details className="group">
        <summary className="cursor-pointer text-gray-400 hover:text-gold p-1">&#9776;</summary>
        <div className="absolute right-4 top-14 bg-navy border border-white/10 rounded-xl shadow-2xl py-2 min-w-[180px] z-50">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 text-sm ${
                pathname === item.href ? 'text-gold bg-gold/10' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {item.icon} {t(item.labelEn, item.labelId)}
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}
