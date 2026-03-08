'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { LogOut, RefreshCw, Save, Trash2, Plus, Eye } from 'lucide-react';
import type { Booking, Room, BlockedDate, Activity, ActivitySlot } from '@/types';

type Tab = 'bookings' | 'availability' | 'activities' | 'ical';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('bookings');

  // State voor de admin data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [slots, setSlots] = useState<ActivitySlot[]>([]);

  // Formuliervelden
  const [selectedRoom, setSelectedRoom] = useState('');
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [icalUrl, setIcalUrl] = useState('');
  const [icalRoom, setIcalRoom] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Slot toevoegen
  const [slotActivity, setSlotActivity] = useState('');
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [slotMax, setSlotMax] = useState(8);

  // Inloggen
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
      setLoginError('');
      loadAllData();
    } else {
      setLoginError('Onjuist wachtwoord');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsLoggedIn(false);
  };

  // Controleer of al ingelogd (via cookie)
  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => { if (r.ok) { setIsLoggedIn(true); loadAllData(); } })
      .catch(() => {});
  }, []);

  const loadAllData = async () => {
    const [bookingsRes, availRes, actRes] = await Promise.all([
      fetch('/api/admin/bookings'),
      fetch('/api/admin/blocked-dates'),
      fetch('/api/activities'),
    ]);
    const [b, a, act] = await Promise.all([bookingsRes.json(), availRes.json(), actRes.json()]);
    setBookings(b.bookings || []);
    setRooms(b.rooms || []);
    setBlockedDates(a.blockedDates || []);
    setActivities(act.activities || []);
  };

  // Boekingstatus wijzigen
  const updateBookingStatus = async (bookingId: string, status: string) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status }),
    });
    loadAllData();
  };

  // Datum blokkeren
  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !blockDate) return;
    await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: selectedRoom, date: blockDate, reason: blockReason }),
    });
    setBlockDate('');
    setBlockReason('');
    loadAllData();
  };

  // Datum deblokkeren
  const handleUnblock = async (id: string) => {
    await fetch(`/api/admin/blocked-dates?id=${id}`, { method: 'DELETE' });
    loadAllData();
  };

  // iCal URL opslaan
  const handleSaveIcal = async () => {
    if (!icalRoom) return;
    await fetch('/api/ical-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: icalRoom, url: icalUrl }),
    });
    loadAllData();
  };

  // iCal synchroniseren
  const handleSync = async () => {
    if (!icalRoom) return;
    setSyncing(true);
    await fetch(`/api/ical-sync?roomId=${icalRoom}`, { method: 'GET' });
    setSyncing(false);
    loadAllData();
  };

  // Slot toevoegen
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityId: slotActivity, date: slotDate, startTime: slotTime, maxParticipants: slotMax }),
    });
    setSlotDate('');
    setSlotTime('');
    loadAllData();
  };

  // Slots laden voor geselecteerde activiteit
  const loadSlots = async (activityId: string) => {
    const res = await fetch(`/api/admin/slots?activityId=${activityId}`);
    const data = await res.json();
    setSlots(data.slots || []);
  };

  // Slot verwijderen
  const handleDeleteSlot = async (slotId: string) => {
    await fetch(`/api/admin/slots?id=${slotId}`, { method: 'DELETE' });
    if (slotActivity) loadSlots(slotActivity);
  };

  // Als niet ingelogd, toon loginscherm
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="bg-white shadow-lg p-8 w-full max-w-sm">
          <h1 className="font-heading text-2xl text-dark mb-2">Maison Amie</h1>
          <p className="font-body text-sm text-dark/50 mb-6">Beheerpaneel</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-body text-sm text-dark mb-1">Wachtwoord</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
              />
            </div>
            {loginError && <p className="font-body text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="btn-primary w-full text-center">Inloggen</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-dark text-cream px-6 py-4 flex items-center justify-between">
        <h1 className="font-heading text-xl text-cream">Maison Amie — Beheer</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 font-body text-sm text-cream/60 hover:text-cream">
          <LogOut size={16} /> Uitloggen
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0 max-w-6xl mx-auto">
          {([
            { key: 'bookings', label: 'Boekingen' },
            { key: 'availability', label: 'Beschikbaarheid' },
            { key: 'activities', label: 'Activiteiten' },
            { key: 'ical', label: 'iCal sync' },
          ] as { key: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-4 font-body text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-terracotta-600 text-terracotta-600'
                  : 'border-transparent text-gray-500 hover:text-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* TAB: BOEKINGEN */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-dark">Boekingen</h2>
              <button onClick={loadAllData} className="flex items-center gap-2 font-body text-sm text-dark/50 hover:text-dark">
                <RefreshCw size={14} /> Vernieuwen
              </button>
            </div>

            {bookings.length === 0 ? (
              <p className="font-body text-gray-400 text-center py-12">Geen boekingen gevonden</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      {['Gast', 'Suite', 'Aankomst', 'Vertrek', 'Status', 'Acties'].map((h) => (
                        <th key={h} className="px-4 py-3 font-body text-xs uppercase tracking-wide text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => {
                      const room = rooms.find((r) => r.id === booking.room_id);
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-body text-sm font-medium text-dark">{booking.guest_name}</p>
                            <p className="font-body text-xs text-gray-400">{booking.guest_email}</p>
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-dark">
                            {room?.name_nl || '—'}
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-dark">
                            {format(new Date(booking.check_in), 'd MMM yyyy', { locale: nl })}
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-dark">
                            {format(new Date(booking.check_out), 'd MMM yyyy', { locale: nl })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-body text-xs px-2 py-1 rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status === 'confirmed' ? 'Bevestigd' :
                               booking.status === 'cancelled' ? 'Geannuleerd' : 'In afwachting'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {booking.status !== 'confirmed' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="font-body text-xs bg-green-600 text-white px-3 py-1 hover:bg-green-700"
                                >
                                  Bevestig
                                </button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="font-body text-xs bg-red-100 text-red-700 px-3 py-1 hover:bg-red-200"
                                >
                                  Annuleer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: BESCHIKBAARHEID */}
        {activeTab === 'availability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Datum blokkeren */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="font-heading text-xl text-dark mb-5">Datum blokkeren</h2>
              <form onSubmit={handleBlockDate} className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-dark mb-1">Suite *</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    required
                    className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                  >
                    <option value="">Selecteer een suite</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.name_nl}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-sm text-dark mb-1">Datum *</label>
                  <input
                    type="date"
                    required
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-dark mb-1">Reden (optioneel)</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="bijv. eigen gebruik, onderhoud"
                    className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Datum blokkeren
                </button>
              </form>
            </div>

            {/* Geblokkeerde datums */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="font-heading text-xl text-dark mb-5">Geblokkeerde datums</h2>
              {blockedDates.length === 0 ? (
                <p className="font-body text-sm text-gray-400">Geen geblokkeerde datums</p>
              ) : (
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {blockedDates.map((bd) => {
                    const room = rooms.find((r) => r.id === bd.room_id);
                    return (
                      <li key={bd.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="font-body text-sm text-dark">
                            {format(new Date(bd.date), 'd MMM yyyy', { locale: nl })}
                          </p>
                          <p className="font-body text-xs text-gray-400">
                            {room?.name_nl} {bd.reason && `· ${bd.reason}`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnblock(bd.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* TAB: ACTIVITEITEN */}
        {activeTab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slot toevoegen */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="font-heading text-xl text-dark mb-5">Tijdslot toevoegen</h2>
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-dark mb-1">Activiteit *</label>
                  <select
                    value={slotActivity}
                    onChange={(e) => { setSlotActivity(e.target.value); if (e.target.value) loadSlots(e.target.value); }}
                    required
                    className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                  >
                    <option value="">Selecteer een activiteit</option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>{a.name_nl}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-sm text-dark mb-1">Datum *</label>
                    <input type="date" required value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                  </div>
                  <div>
                    <label className="block font-body text-sm text-dark mb-1">Tijd *</label>
                    <input type="time" required value={slotTime}
                      onChange={(e) => setSlotTime(e.target.value)}
                      className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-sm text-dark mb-1">Max. deelnemers</label>
                  <input type="number" min={1} value={slotMax}
                    onChange={(e) => setSlotMax(Number(e.target.value))}
                    className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600" />
                </div>
                <button type="submit" className="btn-primary">
                  Slot toevoegen
                </button>
              </form>
            </div>

            {/* Bestaande slots */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="font-heading text-xl text-dark mb-5">Geplande slots</h2>
              {slots.length === 0 ? (
                <p className="font-body text-sm text-gray-400">Geen slots aangemaakt</p>
              ) : (
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {slots.map((slot) => (
                    <li key={slot.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="font-body text-sm text-dark">
                          {format(new Date(slot.date), 'd MMM yyyy', { locale: nl })} — {slot.start_time.slice(0, 5)}
                        </p>
                        <p className="font-body text-xs text-gray-400">
                          {slot.booked_count}/{slot.max_participants} deelnemers
                        </p>
                      </div>
                      <button onClick={() => handleDeleteSlot(slot.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* TAB: ICAL SYNC */}
        {activeTab === 'ical' && (
          <div className="bg-white shadow-sm p-6 max-w-2xl">
            <h2 className="font-heading text-xl text-dark mb-2">iCal synchronisatie</h2>
            <p className="font-body text-sm text-dark/60 mb-6">
              Voeg een iCal-link toe van Booking.com of Airbnb om automatisch beschikbaarheid bij te werken.
              De link vindt u in het dashboard van het betreffende platform.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm text-dark mb-1">Suite *</label>
                <select
                  value={icalRoom}
                  onChange={(e) => {
                    setIcalRoom(e.target.value);
                    const room = rooms.find((r) => r.id === e.target.value);
                    setIcalUrl(room?.ical_url || '');
                  }}
                  className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                >
                  <option value="">Selecteer een suite</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>{r.name_nl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body text-sm text-dark mb-1">iCal URL (van Booking.com / Airbnb)</label>
                <input
                  type="url"
                  value={icalUrl}
                  onChange={(e) => setIcalUrl(e.target.value)}
                  placeholder="https://admin.booking.com/...ical..."
                  className="w-full border border-dark/20 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-terracotta-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSaveIcal}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={14} /> URL opslaan
                </button>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={!icalRoom || syncing}
                  className="btn-secondary flex items-center gap-2 disabled:opacity-40"
                >
                  <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Bezig...' : 'Nu synchroniseren'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
