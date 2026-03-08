'use client';

import { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, isBefore, startOfToday, addDays } from 'date-fns';
import { nl, fr, enUS } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';

// Locale mapping voor de kalender
const calendarLocales: Record<string, typeof nl> = { nl, fr, en: enUS };

interface BookingCalendarProps {
  roomId: string;
  onRangeSelect: (range: DateRange | undefined) => void;
}

export default function BookingCalendar({ roomId, onRangeSelect }: BookingCalendarProps) {
  const locale = useLocale();
  const t = useTranslations('booking');
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Haal geblokkeerde datums op voor de geselecteerde kamer
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    fetch(`/api/availability?roomId=${roomId}`)
      .then((r) => r.json())
      .then((data) => {
        const dates = (data.blockedDates || []).map((d: string) => new Date(d));
        setBlockedDates(dates);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    onRangeSelect(selectedRange);
  };

  const today = startOfToday();

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-8 text-dark/50 font-body">{t('loading' as any) || 'Laden...'}</div>
      ) : (
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={[
            { before: addDays(today, 1) }, // Geen datums in het verleden
            ...blockedDates,
          ]}
          locale={calendarLocales[locale]}
          numberOfMonths={2}
          showOutsideDays={false}
          className="font-body"
          classNames={{
            root: 'w-full',
            months: 'flex flex-col sm:flex-row gap-6',
            month: 'flex-1',
            caption: 'flex items-center justify-between mb-4',
            caption_label: 'font-heading text-lg text-dark capitalize',
            nav: 'flex items-center gap-2',
            nav_button: 'p-1 hover:text-terracotta-600 transition-colors',
            table: 'w-full border-collapse',
            head_row: 'flex mb-1',
            head_cell: 'flex-1 text-center font-body text-xs text-dark/40 uppercase tracking-wide py-1',
            row: 'flex w-full',
            cell: 'flex-1 text-center p-0',
            day: 'w-full aspect-square flex items-center justify-center font-body text-sm hover:bg-ocher-100 transition-colors rounded-none cursor-pointer',
            day_selected: 'bg-terracotta-600 text-white hover:bg-terracotta-700',
            day_range_middle: 'bg-terracotta-100 text-dark rounded-none',
            day_range_start: 'bg-terracotta-600 text-white',
            day_range_end: 'bg-terracotta-600 text-white',
            day_disabled: 'text-dark/20 cursor-not-allowed line-through hover:bg-transparent',
            day_today: 'font-bold text-terracotta-600',
            day_outside: 'text-transparent',
          }}
        />
      )}

      {/* Geselecteerde datums weergeven */}
      {range?.from && range?.to && (
        <div className="mt-4 p-4 bg-ocher-50 border border-ocher-200">
          <div className="flex justify-between text-sm font-body">
            <span>
              <span className="text-dark/50">{t('checkIn')}: </span>
              <span className="font-semibold">{format(range.from, 'dd MMMM yyyy', { locale: calendarLocales[locale] })}</span>
            </span>
            <span>
              <span className="text-dark/50">{t('checkOut')}: </span>
              <span className="font-semibold">{format(range.to, 'dd MMMM yyyy', { locale: calendarLocales[locale] })}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
