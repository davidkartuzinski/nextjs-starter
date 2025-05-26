import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from '@/cms-core/lib/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request) {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const negotiator = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  });
  return (
    locales.find((locale) =>
      negotiator.languages().includes(locale)
    ) || defaultLocale
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(PUBLIC_FILE) ||
    locales.some((locale) => pathname.startsWith(`/${locale}`))
  ) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
