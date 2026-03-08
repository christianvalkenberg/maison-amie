import { getTranslations } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase';
import type { Room } from '@/types';
import RoomCard from '@/components/RoomCard';

async function getRooms(): Promise<Room[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('rooms').select('*').order('created_at');
    return data || [];
  } catch {
    return [];
  }
}

export default async function AccommodatiePage() {
  const t = await getTranslations('accommodation');
  const rooms = await getRooms();

  return (
    <div className="pt-20">
      {/* Paginaheader */}
      <div className="bg-dark text-cream py-20 md:py-28">
        <div className="container-main text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-ocher-400 mb-4">
            Nos suites
          </p>
          <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">{t('title')}</h1>
          <p className="font-body text-cream/70 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Kameroverzicht */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-body text-dark/50 text-lg">
                Suites worden binnenkort toegevoegd.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
