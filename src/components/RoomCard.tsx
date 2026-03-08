'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Euro } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Room } from '@/types';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const t = useTranslations('accommodation');
  const locale = useLocale();

  // Selecteer de juiste taal voor naam en omschrijving
  const name = room[`name_${locale}` as keyof Room] as string || room.name_nl;
  const description = room[`description_${locale}` as keyof Room] as string || room.description_nl;
  const firstImage = room.images[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';

  return (
    <div className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Kamerafbeelding */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={firstImage}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Prijs badge */}
        <div className="absolute bottom-4 right-4 bg-dark/80 text-cream px-3 py-1">
          <span className="font-body text-xs text-cream/70">{t('from')} </span>
          <span className="font-heading text-lg text-cream">€{room.price_per_night}</span>
          <span className="font-body text-xs text-cream/70"> / {t('perNight').replace('per ', '')}</span>
        </div>
      </div>

      {/* Kaartinhoud */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-heading text-xl text-dark">{name}</h3>
          <div className="flex items-center gap-1 text-dark/50 text-sm shrink-0 ml-2">
            <Users size={14} />
            <span>{room.max_guests} {t('guests')}</span>
          </div>
        </div>

        <p className="font-body text-sm text-dark/70 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Voorzieningen */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-5">
            <p className="font-body text-xs tracking-widest uppercase text-dark/40 mb-2">
              {t('amenities')}
            </p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="font-body text-xs bg-cream text-dark/60 px-2 py-1 border border-dark/10"
                >
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 4 && (
                <span className="font-body text-xs text-dark/40">
                  +{room.amenities.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          href={`/${locale}/boeken?room=${room.id}`}
          className="btn-primary w-full text-center block text-sm"
        >
          {t('book')}
        </Link>
      </div>
    </div>
  );
}
