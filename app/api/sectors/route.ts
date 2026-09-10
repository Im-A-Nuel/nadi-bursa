import { NextRequest, NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/sectors/endpoints';

type Resource = keyof typeof ENDPOINTS;

const ALLOWED_RESOURCES: readonly Resource[] = [
  'screener',
  'daily',
  'close',
  'companyReport',
  'brokerSummary',
  'foreignFlow',
  'topChanges',
  'idxTotal',
  'indexDaily',
  'filings',
];

function isResource(value: string | null): value is Resource {
  return value !== null && ALLOWED_RESOURCES.includes(value as Resource);
}

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get('resource');
  const fetchedAt = new Date().toISOString();

  if (!isResource(resource)) {
    return NextResponse.json({ error: 'Unsupported Sectors resource.' }, { status: 400 });
  }

  const apiKey = process.env.SECTORS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ source: 'demo', data: null, fetchedAt });
  }

  const upstream = new URL(`https://api.sectors.app/v2${ENDPOINTS[resource]}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    if (key !== 'resource') upstream.searchParams.set(key, value);
  });

  try {
    const response = await fetch(upstream, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ source: 'demo', data: null, fetchedAt });
    }

    return NextResponse.json({ source: 'live', data: await response.json(), fetchedAt });
  } catch {
    return NextResponse.json({ source: 'demo', data: null, fetchedAt });
  }
}
