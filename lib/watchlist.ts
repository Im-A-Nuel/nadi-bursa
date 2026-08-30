// lib/watchlist.ts - localStorage persistence, one-click add/remove
export const WATCHLIST_KEY = 'sinyal_watchlist';

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(symbols: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(symbols));
}

export function addToWatchlist(symbol: string): string[] {
  const wl = getWatchlist();
  if (!wl.includes(symbol)) {
    wl.push(symbol);
    saveWatchlist(wl);
  }
  return wl;
}

export function removeFromWatchlist(symbol: string): string[] {
  const wl = getWatchlist().filter(s => s !== symbol);
  saveWatchlist(wl);
  return wl;
}

export function isInWatchlist(symbol: string): boolean {
  return getWatchlist().includes(symbol);
}
