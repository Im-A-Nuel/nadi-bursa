import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--faint)]">SCT-HACK-2026 / 404</div>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">Halaman tidak ditemukan.</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Ticker yang tidak dikenal atau alamat yang salah. Kembali ke meja intelijen untuk melanjutkan.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Ke beranda</Link>
        <Link href="/screener" className="btn-line">Ke saringan</Link>
      </div>
    </div>
  );
}