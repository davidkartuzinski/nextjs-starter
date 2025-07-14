import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '../cms-core/lib/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request) {
  // Simple locale detection from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';

  // Find the first supported locale in the Accept-Language header
  for (const locale of locales) {
    if (acceptLanguage.toLowerCase().includes(locale.toLowerCase())) {
      return locale;
    }
  }

  return defaultLocale;
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
