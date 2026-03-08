-- Maison Amie — Supabase database schema
-- Voer dit uit in de Supabase SQL editor

-- Suites / Kamers
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_nl TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_nl TEXT,
  description_fr TEXT,
  description_en TEXT,
  max_guests INTEGER DEFAULT 2,
  price_per_night DECIMAL(10,2),
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  ical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boekingsverzoeken van gasten
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'manual', 'ical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geblokkeerde datums (handmatig of via iCal sync)
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason TEXT,
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, date)
);

-- Activiteiten
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_nl TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_nl TEXT,
  description_fr TEXT,
  description_en TEXT,
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  max_participants INTEGER DEFAULT 10,
  category TEXT CHECK (category IN ('workshop', 'rental', 'outdoor')),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tijdslots voor activiteiten (aangemaakt door admin)
CREATE TABLE activity_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  max_participants INTEGER NOT NULL,
  booked_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Boekingen voor activiteiten
CREATE TABLE activity_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES activity_slots(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  participants INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  room_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor sneller opzoeken van geblokkeerde datums
CREATE INDEX idx_blocked_dates_room_date ON blocked_dates(room_id, date);
CREATE INDEX idx_bookings_room_dates ON bookings(room_id, check_in, check_out);
CREATE INDEX idx_activity_slots_date ON activity_slots(activity_id, date);
