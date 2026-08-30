'use client';
import Link from 'next/link';
import { MockDataBadge } from '@/components/common/MockDataBadge';

export default function HomePage() {
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Sinyal Hari Ini</h1>
        <MockDataBadge />
      </div>
      <p className="text-gray-400 text-lg mb-8 max-w-2xl">
        IDX market intelligence dashboard for Indonesian retail investors. Derived insights, anomaly detection, foreign flow signals, and automated daily briefs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/', title: 'Dashboard', desc: 'Health scores for all tickers', icon: '\u25C9', color: '#C6A664' },
          { href: '/screener', title: 'Screener', desc: 'Filter and sort IDX stocks', icon: '\u25A3', color: '#0E8074' },
          { href: '/radar', title: 'Anomaly Radar', desc: 'Unusual price/volume moves', icon: '\u25CE', color: '#EF4444' },
          { href: '/brief', title: 'Daily Brief', desc: '08:30 WIB morning briefing', icon: '\u2709', color: '#3B82F6' },
          { href: '/scheduler', title: 'Scheduler Log', desc: 'Automation evidence', icon: '\u23F0', color: '#8B5CF6' },
          { href: '/about', title: 'About', desc: 'Architecture and credits', icon: '\u2139', color: '#6B7280' },
        ].map(c => (
          <Link key={c.href} href={c.href} className="card card-hover group">
            <div className="text-3xl mb-3">{c.icon}</div>
            <h3 className="text-white font-semibold text-lg group-hover:text-gold transition-colors">{c.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
