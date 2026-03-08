import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// GET /api/availability — geeft kamers + geblokkeerde datums terug
// GET /api/availability?roomId=xxx — geeft geblokkeerde datums voor één kamer
export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get('roomId');
  const supabase = createAdminClient();

  try {
    // Haal alle kamers op (voor de boekpagina)
    const { data: rooms } = await supabase.from('rooms').select('*').order('created_at');

    if (!roomId) {
      return NextResponse.json({ rooms: rooms || [] });
    }

    // Haal geblokkeerde datums op voor deze kamer
    const { data: blocked } = await supabase
      .from('blocked_dates')
      .select('date')
      .eq('room_id', roomId);

    // Haal ook bestaande bevestigde/onbevestigde boekingen op
    const { data: bookings } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('room_id', roomId)
      .neq('status', 'cancelled');

    // Combineer geblokkeerde datums en boekingen tot één lijst
    const blockedDates: string[] = [];

    (blocked || []).forEach((b) => blockedDates.push(b.date));

    // Voeg alle datums binnen elke boeking toe
    (bookings || []).forEach((booking) => {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        blockedDates.push(d.toISOString().split('T')[0]);
      }
    });

    return NextResponse.json({ rooms: rooms || [], blockedDates });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json({ error: 'Fout bij ophalen beschikbaarheid' }, { status: 500 });
  }
}
