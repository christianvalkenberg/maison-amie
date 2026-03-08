'use client';

import Image from 'next/image';
import { Clock, Users, Euro } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
  onBook: (activity: Activity) => void;
}

// Standaard afbeeldingen per categorie als er geen afbeelding is
const categoryImages: Record<string, string> = {
  workshop: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
  rental: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  outdoor: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
};

export default function ActivityCard({ activity, onBook }: ActivityCardProps) {
  const t = useTranslations('activities');
  const locale = useLocale();

  const name = activity[`name_${locale}` as keyof Activity] as string || activity.name_nl;
  const description = activity[`description_${locale}` as keyof Activity] as string || activity.description_nl;
  const image = activity.image || categoryImages[activity.category] || categoryImages.workshop;
  const categoryLabel = t(`category.${activity.category}`);

  return (
    <div className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Activiteitsafbeelding */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Categorie badge */}
        <div className="absolute top-4 left-4 bg-olive-500 text-white px-3 py-1">
          <span className="font-body text-xs tracking-wide uppercase">{categoryLabel}</span>
        </div>
      </div>

      {/* Kaartinhoud */}
      <div className="p-6">
        <h3 className="font-heading text-xl text-dark mb-2">{name}</h3>
        <p className="font-body text-sm text-dark/70 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Details: prijs, duur, deelnemers */}
        <div className="flex items-center gap-4 mb-5 text-sm">
          <div className="flex items-center gap-1 text-terracotta-600 font-semibold">
            <Euro size={14} />
            <span>{activity.price}</span>
            <span className="text-dark/50 font-normal text-xs">/{t('perPerson')}</span>
          </div>
          <div className="flex items-center gap-1 text-dark/50">
            <Clock size={14} />
            <span>{activity.duration_minutes} {t('minutes')}</span>
          </div>
          <div className="flex items-center gap-1 text-dark/50">
            <Users size={14} />
            <span>max {activity.max_participants}</span>
          </div>
        </div>

        <button
          onClick={() => onBook(activity)}
          className="btn-primary w-full text-sm"
        >
          {t('book')}
        </button>
      </div>
    </div>
  );
}
