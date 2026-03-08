'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { differenceInDays } from 'date-fns';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { Room } from '@/types';
import BookingCalendar from '@/components/BookingCalendar';

export default function BoekenPage() {
  const t = useTranslations('booking');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const preselectedRoomId = searchParams.get('room');

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(preselectedRoomId || '');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    message: '',
  });

  // Laad kamers
  useEffect(() => {
    fetch('/api/availability')
      .then((r) => r.json())
      .then((data) => setRooms(data.rooms || []));
  }, []);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;
  const totalPrice = selectedRoom ? nights * selectedRoom.price_per_night : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !dateRange?.from || !dateRange?.to) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoomId,
          checkIn: dateRange.from.toISOString().split('T')[0],
          checkOut: dateRange.to.toISOString().split('T')[0],
          ...form,
        }),
      });

      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="container-main max-w-2xl text-center py-20">
          <CheckCircle className="text-olive-600 mx-auto mb-4" size={48} />
          <h1 className="font-heading text-3xl text-dark mb-4">{t('success')}</h1>
          <p className="font-body text-dark/60">info@maisonamie.fr</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Paginaheader */}
      <div className="bg-dark text-cream py-20 md:py-28">
        <div className="container-main text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-ocher-400 mb-4">
            Réservation
          </p>
          <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">{t('title')}</h1>
          <p className="font-body text-cream/70 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container-main">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Linkerkant: keuze + kalender */}
              <div className="lg:col-span-2 space-y-8">
                {/* Stap 1: Suite kiezen */}
                <div>
                  <h2 className="font-heading text-2xl text-dark mb-4">
                    <span className="text-terracotta-600 mr-2">1.</span>
                    {t('selectRoom')}
                  </h2>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => { setSelectedRoomId(e.target.value); setDateRange(undefined); }}
                    className="w-full border border-dark/20 bg-white px-4 py-3 font-body text-sm text-dark focus:outline-none focus:border-terracotta-600 appearance-none cursor-pointer"
                  >
                    <option value="">{t('allRooms')}</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {(room as any)[`name_${locale}`] || room.name_nl} — €{room.price_per_night}/nacht
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stap 2: Data kiezen */}
                <div>
                  <h2 className="font-heading text-2xl text-dark mb-4">
                    <span className="text-terracotta-600 mr-2">2.</span>
                    {t('selectDates')}
                  </h2>
                  {selectedRoomId ? (
                    <BookingCalendar roomId={selectedRoomId} onRangeSelect={setDateRange} />
                  ) : (
                    <p className="font-body text-sm text-dark/40 p-4 border border-dark/10 border-dashed">
                      {t('selectRoomFirst')}
                    </p>
                  )}
                </div>

                {/* Stap 3: Persoonsgegevens */}
                <div>
                  <h2 className="font-heading text-2xl text-dark mb-4">
                    <span className="text-terracotta-600 mr-2">3.</span>
                    {t('personalDetails')}
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{t('name')} *</label>
                        <input type="text" required value={form.name}
                          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{t('email')} *</label>
                        <input type="email" required value={form.email}
                          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{t('phone')}</label>
                        <input type="tel" value={form.phone}
                          onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{t('guests')}</label>
                        <input type="number" min={1} max={selectedRoom?.max_guests || 10} value={form.guests}
                          onChange={(e) => setForm(f => ({ ...f, guests: Number(e.target.value) }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-body text-sm text-dark mb-1">{t('message')}</label>
                      <textarea rows={4} value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t('messagePlaceholder')}
                        className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600 resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rechterkant: samenvattingspaneel */}
              <div>
                <div className="sticky top-24 bg-white border border-dark/10 p-6">
                  <h3 className="font-heading text-xl text-dark mb-5">Samenvatting</h3>

                  {selectedRoom ? (
                    <div className="mb-5 pb-5 border-b border-dark/10">
                      <p className="font-body text-xs uppercase tracking-wide text-dark/40 mb-1">Suite</p>
                      <p className="font-body font-semibold text-dark">
                        {(selectedRoom as any)[`name_${locale}`] || selectedRoom.name_nl}
                      </p>
                      <p className="font-body text-sm text-dark/60">
                        €{selectedRoom.price_per_night} / {t('nights').slice(-5)}
                      </p>
                    </div>
                  ) : (
                    <p className="font-body text-sm text-dark/40 mb-5">{t('selectRoomFirst')}</p>
                  )}

                  {nights > 0 && (
                    <div className="mb-5 pb-5 border-b border-dark/10">
                      <div className="flex justify-between text-sm font-body mb-1">
                        <span className="text-dark/60">{nights} {t('nights')}</span>
                        <span className="font-semibold">€{totalPrice}</span>
                      </div>
                    </div>
                  )}

                  {totalPrice > 0 && (
                    <div className="flex justify-between font-body font-bold text-dark mb-6">
                      <span>{t('totalPrice')}</span>
                      <span className="text-terracotta-600 text-lg">€{totalPrice}</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <AlertCircle size={16} />
                      <p className="font-body text-xs">{t('error')}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedRoomId || !dateRange?.from || !dateRange?.to || status === 'loading'}
                    className="btn-primary w-full text-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? t('submitting') : t('submit')}
                  </button>

                  <p className="font-body text-xs text-dark/40 text-center mt-3">
                    Fase 1: reserveringsverzoek per e-mail
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
