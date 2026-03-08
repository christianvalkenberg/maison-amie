'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tContact = useTranslations('contact');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-cream/80">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Kolom 1: Over Maison Amie */}
          <div>
            <h3 className="font-heading text-2xl text-cream mb-4">Maison Amie</h3>
            <p className="font-body text-sm leading-relaxed text-cream/70">{t('description')}</p>
          </div>

          {/* Kolom 2: Snelle links */}
          <div>
            <h4 className="font-body text-sm tracking-widest uppercase text-ocher-400 mb-4">
              {t('links')}
            </h4>
            <ul className="space-y-2">
              {[
                { key: 'home', href: '/' },
                { key: 'accommodation', href: '/accommodatie' },
                { key: 'activities', href: '/activiteiten' },
                { key: 'book', href: '/boeken' },
                { key: 'contact', href: '/contact' },
              ].map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="font-body text-sm text-cream/70 hover:text-cream transition-colors duration-200"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Contactgegevens */}
          <div>
            <h4 className="font-body text-sm tracking-widest uppercase text-ocher-400 mb-4">
              {t('contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-terracotta-400 mt-0.5 shrink-0" />
                <span className="font-body text-sm text-cream/70">
                  {tContact('info.address')}, {tContact('info.region')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-terracotta-400 shrink-0" />
                <a
                  href={`mailto:${tContact('info.email')}`}
                  className="font-body text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  {tContact('info.email')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-terracotta-400 shrink-0" />
                <a
                  href={`tel:${tContact('info.phone')}`}
                  className="font-body text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  {tContact('info.phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Onderkant: copyright */}
        <div className="mt-10 pt-8 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-cream/40">
            © {year} Maison Amie. {t('rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
