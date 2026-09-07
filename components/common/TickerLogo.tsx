'use client';

import { useState } from 'react';

type Props = { symbol: string; name?: string; size?: number; sector?: string };

/* Real IDX logo assets, mapped to each company's ticker symbol. */
const LOGO_URLS: Record<string, string> = {
  BBCA: 'https://companieslogo.com/img/orig/BBCA.JK-8274fa77.png?t=1720244490',
  BBRI: 'https://companieslogo.com/img/orig/BBRI.JK-5df5ada2.png?t=1720244490',
  BMRI: 'https://companieslogo.com/img/orig/BMRI.JK-9759531a.png?t=1720244491',
  TLKM: 'https://companieslogo.com/img/orig/TLK-08f588e1.png?t=1720244494',
  ASII: 'https://companieslogo.com/img/orig/ASII.JK-29750a20.png?t=1730278888',
  ADRO: 'https://companieslogo.com/img/orig/ADRO.JK-7e91a27c.png?t=1720244490',
  UNVR: 'https://companieslogo.com/img/orig/UNVR.JK-4c76e4be.png?t=1720244494',
  ICBP: 'https://companieslogo.com/img/orig/ICBP.JK-7d9153f9.png?t=1747731122',
  GOTO: 'https://companieslogo.com/img/orig/GOTO.JK-2bf68c41.png?t=1752734913',
  BRPT: 'https://companieslogo.com/img/orig/BRPT.JK-0be93789.png?t=1720244491',
};

const FALLBACK_COLORS: Record<string, string> = {
  BBCA: '#1B4EA0',
  BBRI: '#0A49A1',
  BMRI: '#003B71',
  TLKM: '#E3262E',
  ASII: '#E2001A',
  ADRO: '#1E4F8F',
  UNVR: '#0B5BA7',
  ICBP: '#D71920',
  GOTO: '#00A9A5',
  BRPT: '#2C2C2C',
};

function fallbackLabel(symbol: string) {
  return symbol.slice(0, 2);
}

function LogoFallback({ symbol, name, size }: Props) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 grid place-items-center rounded-full border border-white/15 font-bold tracking-tight text-white"
      style={{
        width: size,
        height: size,
        background: FALLBACK_COLORS[symbol] || '#334155',
        fontSize: size && size <= 28 ? 9 : 11,
      }}
      title={name ? `${symbol} - ${name}` : symbol}
    >
      {fallbackLabel(symbol)}
    </span>
  );
}

export function TickerLogo({ symbol, name, size = 32 }: Props) {
  const [failed, setFailed] = useState(false);
  const normalized = symbol.toUpperCase();
  const logoUrl = LOGO_URLS[normalized] || null;

  if (!logoUrl || failed) return <LogoFallback symbol={normalized} name={name} size={size} />;

  return (
    <span
      className="shrink-0 grid place-items-center rounded-full border border-white/10 bg-white"
      style={{ width: size, height: size }}
      title={name ? `${symbol} - ${name}` : symbol}
    >
      <img
        src={logoUrl}
        alt={`${name || symbol} logo`}
        width={size - 8}
        height={size - 8}
        className="rounded-full object-contain"
        style={{ width: size - 8, height: size - 8 }}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export const tickerLogoUrl = (symbol: string) => LOGO_URLS[symbol.toUpperCase()] || null;
