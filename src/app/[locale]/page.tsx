import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { MapPin } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase';
import type { Room, Activity } from '@/types';
import RoomCard from '@/components/RoomCard';

// Echte foto's van het pand
const PHOTOS = {
  hero:     'https://lb-eu.green-acres.com/3253676/Alr7baxu7duusqks/Photos/Alr7baxu7duusqks_1.jpg',
  welcome:  'https://lb-eu.green-acres.com/3253676/Alr7baxu7duusqks/Photos/Alr7baxu7duusqks_3.jpg',
  location: 'https://lb-eu.green-acres.com/3253676/Alr7baxu7duusqks/Photos/Alr7baxu7duusqks_10.jpg',
};

async function getRooms(): Promise<Room[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('rooms').select('*').order('created_at');
    return data || [];
  } catch {
    return [];
  }
}

async function getActivities(): Promise<Activity[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('activities').select('*').order('created_at');
    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const t = await getTranslations('home');
  const locale = await getLocale();
  const [rooms, activities] = await Promise.all([getRooms(), getActivities()]);

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={PHOTOS.hero}
          alt="Maison Aimie — Chambres d'hôtes nabij Revel"
          fill className="object-cover" priority sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="relative z-10 text-center text-cream px-4 max-w-3xl mx-auto">
          {/* Logo als sierlijk centerstuk */}
          <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-5 mb-10 shadow-lg">
            <img src="/logo.png" alt="Maison Aimie" className="h-28 md:h-36 w-auto mx-auto" />
          </div>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-ocher-300 mb-4">{t('hero.tagline')}</p>
          <h1 className="font-heading text-5xl md:text-7xl text-cream mb-6 leading-tight">{t('hero.title')}</h1>
          <p className="font-body text-lg md:text-xl text-cream/80 mb-10 leading-relaxed">{t('hero.subtitle')}</p>
          <Link href={`/${locale}/boeken`} className="btn-primary text-base px-8 py-4">{t('hero.cta')}</Link>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 animate-bounce">
          <div className="w-px h-12 bg-cream/40 mx-auto mb-2" />
        </div>
      </section>

      {/* WELKOM */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-600 mb-4">Bienvenue</p>
              <h2 className="section-title">{t('welcome.title')}</h2>
              <p className="font-body text-base text-dark/70 leading-relaxed mb-8">{t('welcome.text')}</p>
              <Link href={`/${locale}/accommodatie`} className="btn-secondary">{t('welcome.cta')}</Link>
            </div>
            <div className="relative">
              <div className="relative h-96 md:h-[500px]">
                <Image src={PHOTOS.welcome} alt="Maison Aimie" fill className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-ocher-300 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* FOTOGALERIJ */}
      <section className="py-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {[4, 6, 8, 9].map((n) => (
            <div key={n} className="relative h-48 md:h-64 overflow-hidden">
              <Image
                src={`https://lb-eu.green-acres.com/3253676/Alr7baxu7duusqks/Photos/Alr7baxu7duusqks_${n}.jpg`}
                alt={`Maison Aimie — foto ${n}`} fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* SUITES */}
      <section className="py-20 bg-dark/5">
        <div className="container-main">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-600 mb-3">Nos suites</p>
            <h2 className="section-title mx-auto">{t('rooms.title')}</h2>
            <p className="section-subtitle mx-auto text-center">{t('rooms.subtitle')}</p>
          </div>
          {rooms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {rooms.slice(0, 3).map((room) => <RoomCard key={room.id} room={room} />)}
              </div>
              <div className="text-center">
                <Link href={`/${locale}/accommodatie`} className="btn-secondary">{t('rooms.cta')}</Link>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { n: 11, label: 'Suite La Lavande' },
                  { n: 13, label: 'Suite Le Mistral' },
                  { n: 15, label: 'Suite La Garrigue' },
                ].map(({ n, label }) => (
                  <div key={n} className="bg-white overflow-hidden shadow-sm group">
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={`https://lb-eu.green-acres.com/3253676/Alr7baxu7duusqks/Photos/Alr7baxu7duusqks_${n}.jpg`}
                        alt={label} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-xl text-dark mb-1">{label}</h3>
                      <p className="font-body text-sm text-dark/50">Binnenkort beschikbaar</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href={`/${locale}/boeken`} className="btn-secondary">{t('rooms.cta')}</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* LOCATIE */}
      <section className="py-20 bg-dark text-cream">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-ocher-400 mb-4">Localisation</p>
              <h2 className="font-heading text-3xl md:text-4xl text-cream mb-6">{t('location.title')}</h2>
              <p className="font-body text-cream/70 leading-relaxed mb-8">{t('location.text')}</p>
              <div className="space-y-3">
                {(['distance1', 'distance2', 'distance3'] as const).map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <MapPin size={16} className="text-ocher-400 shrink-0" />
                    <span className="font-body text-sm text-cream/80">{t(`location.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80">
              <Image src={PHOTOS.location} alt="Omgeving Revel" fill className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-terracotta-600">
        <div className="container-main text-center">
          <h2 className="font-heading text-3xl md:text-5xl text-cream mb-4">{t('cta.title')}</h2>
          <p className="font-body text-cream/80 text-lg mb-10 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/boeken`}
            className="inline-block bg-cream text-terracotta-700 hover:bg-ocher-100 px-8 py-4 font-body font-semibold tracking-wide transition-colors duration-200">
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </>
  );
}
