'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import type { Activity, ActivitySlot } from '@/types';
import ActivityCard from '@/components/ActivityCard';
import { format } from 'date-fns';
import { nl, fr, enUS } from 'date-fns/locale';

const calendarLocales: Record<string, typeof nl> = { nl, fr, en: enUS };

export default function ActiviteitenPage() {
  const t = useTranslations('activities');
  const tBooking = useTranslations('booking');
  const locale = useLocale();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [slots, setSlots] = useState<ActivitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<ActivitySlot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', participants: 1 });

  // Laad activiteiten
  useEffect(() => {
    fetch('/api/activities')
      .then((r) => r.json())
      .then((data) => setActivities(data.activities || []));
  }, []);

  // Laad slots als er een activiteit en datum geselecteerd is
  useEffect(() => {
    if (!selectedActivity || !selectedDate) return;
    fetch(`/api/activities?activityId=${selectedActivity.id}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []));
  }, [selectedActivity, selectedDate]);

  const handleBook = (activity: Activity) => {
    setSelectedActivity(activity);
    setSlots([]);
    setSelectedDate('');
    setSelectedSlot(null);
    setStatus('idle');
    setForm({ name: '', email: '', phone: '', participants: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/activity-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot.id, ...form }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-20">
      {/* Paginaheader */}
      <div className="bg-olive-600 text-cream py-20 md:py-28">
        <div className="container-main text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-ocher-300 mb-4">
            Activités
          </p>
          <h1 className="font-heading text-4xl md:text-6xl text-cream mb-4">{t('title')}</h1>
          <p className="font-body text-cream/80 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Activiteitengrid */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          {activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} onBook={handleBook} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-body text-dark/50">Activiteiten worden binnenkort toegevoegd.</p>
            </div>
          )}
        </div>
      </section>

      {/* Boekmodal voor activiteit */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-cream max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-dark/10">
              <h2 className="font-heading text-xl text-dark">
                {tBooking('activityTitle')}
              </h2>
              <button onClick={() => setSelectedActivity(null)} className="text-dark/40 hover:text-dark">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="font-body text-sm text-dark/60 mb-1">{t('selectDate')}</p>
              <p className="font-heading text-lg text-terracotta-600 mb-4">
                {(selectedActivity as any)[`name_${locale}`] || selectedActivity.name_nl}
              </p>

              {status === 'success' ? (
                <div className="flex items-start gap-3 p-4 bg-olive-50 border border-olive-200">
                  <CheckCircle className="text-olive-600 shrink-0 mt-0.5" size={20} />
                  <p className="font-body text-sm text-olive-800">{tBooking('activitySuccess')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Datumkeuze */}
                  <div>
                    <label className="block font-body text-sm text-dark mb-1">{t('selectDate')} *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                      className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                    />
                  </div>

                  {/* Tijdslots */}
                  {selectedDate && (
                    <div>
                      <label className="block font-body text-sm text-dark mb-2">{t('selectTime')} *</label>
                      {slots.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => {
                            const isFull = slot.booked_count >= slot.max_participants;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={isFull}
                                onClick={() => setSelectedSlot(slot)}
                                className={`px-4 py-2 font-body text-sm border transition-colors ${
                                  selectedSlot?.id === slot.id
                                    ? 'bg-terracotta-600 text-white border-terracotta-600'
                                    : isFull
                                    ? 'border-dark/10 text-dark/30 cursor-not-allowed line-through'
                                    : 'border-dark/20 text-dark hover:border-terracotta-600'
                                }`}
                              >
                                {slot.start_time.slice(0, 5)}
                                {isFull && ' (vol)'}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="font-body text-sm text-dark/50">{t('noSlots')}</p>
                      )}
                    </div>
                  )}

                  {/* Persoonsgegevens */}
                  {selectedSlot && (
                    <>
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{tBooking('name')} *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{tBooking('email')} *</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                      <div>
                        <label className="block font-body text-sm text-dark mb-1">{tBooking('participants')}</label>
                        <input type="number" min={1} max={selectedSlot.max_participants - selectedSlot.booked_count}
                          value={form.participants} onChange={(e) => setForm(f => ({ ...f, participants: Number(e.target.value) }))}
                          className="w-full border border-dark/20 bg-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                      </div>
                    </>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={16} />
                      <p className="font-body text-sm">{tBooking('error')}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedSlot || status === 'loading'}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? tBooking('submitting') : tBooking('submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
