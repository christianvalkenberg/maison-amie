import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="pt-20">
      {/* Paginaheader */}
      <div className="bg-olive-600 text-cream py-20 md:py-28">
        <div className="container-main text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-ocher-300 mb-4">
            Contact
          </p>
          <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">{t('title')}</h1>
          <p className="font-body text-cream/80 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Contactsectie */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contactgegevens */}
            <div>
              <h2 className="font-heading text-2xl text-dark mb-6">{t('info.title')}</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-terracotta-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-dark">{t('info.address')}</p>
                    <p className="font-body text-sm text-dark/60">{t('info.region')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={20} className="text-terracotta-600 shrink-0" />
                  <a
                    href={`mailto:${t('info.email')}`}
                    className="font-body text-sm text-dark hover:text-terracotta-600 transition-colors"
                  >
                    {t('info.email')}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={20} className="text-terracotta-600 shrink-0" />
                  <a
                    href={`tel:${t('info.phone')}`}
                    className="font-body text-sm text-dark hover:text-terracotta-600 transition-colors"
                  >
                    {t('info.phone')}
                  </a>
                </div>
              </div>
            </div>

            {/* Contactformulier */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
