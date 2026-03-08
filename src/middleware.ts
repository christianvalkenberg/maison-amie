import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['nl', 'fr', 'en'];
const defaultLocale = 'nl';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Controleer of het pad al een geldige locale heeft
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) return NextResponse.next();

  // Detecteer voorkeurstaal uit de browser
  const acceptLang = request.headers.get('accept-language') || '';
  const detected = locales.find((locale) =>
    acceptLang.toLowerCase().includes(locale)
  );
  const locale = detected || defaultLocale;

  // Stuur door naar het pad met locale-prefix
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
