import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slotId, name, email, phone, participants } = body;

    if (!slotId || !name || !email) {
      return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Controleer beschikbaarheid van het slot
    const { data: slot } = await supabase
      .from('activity_slots')
      .select('*')
      .eq('id', slotId)
      .single();

    if (!slot) {
      return NextResponse.json({ error: 'Slot niet gevonden' }, { status: 404 });
    }

    const numParticipants = Number(participants) || 1;
    if (slot.booked_count + numParticipants > slot.max_participants) {
      return NextResponse.json({ error: 'Niet genoeg plaatsen beschikbaar' }, { status: 409 });
    }

    // Sla de boeking op
    const { error: insertError } = await supabase.from('activity_bookings').insert({
      slot_id: slotId,
      guest_name: name,
      guest_email: email,
      guest_phone: phone,
      participants: numParticipants,
      status: 'pending',
    });

    if (insertError) throw insertError;

    // Verhoog de booked_count
    await supabase
      .from('activity_slots')
      .update({ booked_count: slot.booked_count + numParticipants })
      .eq('id', slotId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity bookings API error:', error);
    return NextResponse.json({ error: 'Boeking opslaan mislukt' }, { status: 500 });
  }
}
