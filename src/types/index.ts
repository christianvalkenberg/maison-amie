// Alle TypeScript types voor Maison Amie

export interface Room {
  id: string;
  name_nl: string;
  name_fr: string;
  name_en: string;
  description_nl: string;
  description_fr: string;
  description_en: string;
  max_guests: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  ical_url?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  room?: Room;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  source: 'website' | 'manual' | 'ical';
  created_at: string;
}

export interface BlockedDate {
  id: string;
  room_id: string;
  date: string;
  reason?: string;
  source_id?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  name_nl: string;
  name_fr: string;
  name_en: string;
  description_nl: string;
  description_fr: string;
  description_en: string;
  price: number;
  duration_minutes: number;
  max_participants: number;
  category: 'workshop' | 'rental' | 'outdoor';
  image?: string;
  created_at: string;
}

export interface ActivitySlot {
  id: string;
  activity_id: string;
  activity?: Activity;
  date: string;
  start_time: string;
  max_participants: number;
  booked_count: number;
  created_at: string;
}

export interface ActivityBooking {
  id: string;
  slot_id: string;
  slot?: ActivitySlot;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  participants: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  room_booking_id?: string;
  created_at: string;
}
