import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { sendBookingConfirmationToGuest, sendBookingNotificationToHost } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, checkIn, checkOut, name, email, phone, guests, message } = body;

    // Basisvalidatie
    if (!roomId || !checkIn || !checkOut || !name || !email) {
      return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Controleer of de data niet geblokkeerd is
    const { data: blocked } = await supabase
      .from('blocked_dates')
      .select('date')
      .eq('room_id', roomId)
      .gte('date', checkIn)
      .lte('date', checkOut);

    if (blocked && blocked.length > 0) {
      return NextResponse.json({ error: 'Geselecteerde datums zijn niet beschikbaar' }, { status: 409 });
    }

    // Sla de boeking op in de database
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        room_id: roomId,
        guest_name: name,
        guest_email: email,
        guest_phone: phone,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests || 1,
        message,
        source: 'website',
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Haal de kamerinformatie op voor de e-mail
    const { data: room } = await supabase
      .from('rooms')
      .select('name_nl')
      .eq('id', roomId)
      .single();

    // Verstuur bevestigingsmails (niet wachten, doet het op de achtergrond)
    Promise.all([
      sendBookingConfirmationToGuest({
        guestName: name,
        guestEmail: email,
        roomName: room?.name_nl || 'Suite',
        checkIn,
        checkOut,
        guests: guests || 1,
      }),
      sendBookingNotificationToHost({
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        roomName: room?.name_nl || 'Suite',
        checkIn,
        checkOut,
        guests: guests || 1,
        message,
      }),
    ]).catch(console.error);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json({ error: 'Boeking opslaan mislukt' }, { status: 500 });
  }
}
