'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--faint)]">SCT-HACK-2026 / ERROR</div>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">Ada yang salah di meja.</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Data gagal dimuat atau koneksi terputus. Coba lagi; jika berulang, gunakan mode demo yang berjalan offline.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="btn-primary">Coba lagi</button>
        <LinkHref href="/" className="btn-line">Ke beranda</LinkHref>
      </div>
    </div>
  );
}

import Link from 'next/link';

function LinkHref({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}