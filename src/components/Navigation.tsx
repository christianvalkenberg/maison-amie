'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';

// De navigatielinks voor de site
const navLinks = [
  { key: 'home', href: '/' },
  { key: 'accommodation', href: '/accommodatie' },
  { key: 'activities', href: '/activiteiten' },
  { key: 'contact', href: '/contact' },
];

const localeLabels: Record<string, string> = {
  nl: 'NL',
  fr: 'FR',
  en: 'EN',
};

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Verwijder de huidige locale prefix uit het pad
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-dark/10">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Naam */}
          <Link href={`/${locale}`} className="font-heading text-xl md:text-2xl text-dark tracking-wide">
            Maison Amie
          </Link>

          {/* Desktop navigatie */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={`font-body text-sm tracking-widest uppercase transition-colors duration-200 ${
                  pathname === `/${locale}${link.href}` || (link.href === '/' && pathname === `/${locale}`)
                    ? 'text-terracotta-600 border-b border-terracotta-600'
                    : 'text-dark hover:text-terracotta-600'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Rechts: taalwissel + boek-knop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Taalwissel */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm font-body text-dark hover:text-terracotta-600 transition-colors"
              >
                <Globe size={16} />
                {localeLabels[locale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-8 bg-cream border border-dark/10 shadow-lg py-1 min-w-[80px]">
                  {Object.entries(localeLabels).map(([loc, label]) => (
                    <Link
                      key={loc}
                      href={`/${loc}${pathWithoutLocale}`}
                      onClick={() => setLangOpen(false)}
                      className={`block px-4 py-2 text-sm font-body hover:bg-terracotta-50 transition-colors ${
                        loc === locale ? 'text-terracotta-600 font-semibold' : 'text-dark'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Boek nu knop */}
            <Link href={`/${locale}/boeken`} className="btn-primary py-2 px-5 text-sm">
              {t('book')}
            </Link>
          </div>

          {/* Mobiel hamburger menu */}
          <button
            className="md:hidden p-2 text-dark"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu openen"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobiel menu */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-dark/10 py-4">
          <div className="container-main flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                onClick={() => setIsOpen(false)}
                className="font-body text-sm tracking-widest uppercase text-dark hover:text-terracotta-600 py-2"
              >
                {t(link.key)}
              </Link>
            ))}
            <Link
              href={`/${locale}/boeken`}
              onClick={() => setIsOpen(false)}
              className="btn-primary text-center text-sm mt-2"
            >
              {t('book')}
            </Link>
            {/* Taalwissel mobiel */}
            <div className="flex gap-4 pt-2 border-t border-dark/10">
              {Object.entries(localeLabels).map(([loc, label]) => (
                <Link
                  key={loc}
                  href={`/${loc}${pathWithoutLocale}`}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-body ${loc === locale ? 'text-terracotta-600 font-semibold' : 'text-dark'}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
