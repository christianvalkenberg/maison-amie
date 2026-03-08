import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function checkAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET;
}

// GET — alle boekingen + kamers ophalen
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const supabase = createAdminClient();
  const [{ data: bookings }, { data: rooms }] = await Promise.all([
    supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('rooms').select('*'),
  ]);

  return NextResponse.json({ bookings: bookings || [], rooms: rooms || [] });
}

// PATCH — boekingstatus wijzigen
export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const { bookingId, status } = await req.json();
  if (!bookingId || !status) return NextResponse.json({ error: 'bookingId en status verplicht' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);

  if (error) return NextResponse.json({ error: 'Update mislukt' }, { status: 500 });
  return NextResponse.json({ success: true });
}
