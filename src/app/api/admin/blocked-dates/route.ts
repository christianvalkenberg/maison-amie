import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function checkAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET;
}

// GET — alle geblokkeerde datums ophalen
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: blockedDates } = await supabase
    .from('blocked_dates')
    .select('*')
    .order('date');

  return NextResponse.json({ blockedDates: blockedDates || [] });
}

// POST — datum blokkeren
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const { roomId, date, reason } = await req.json();
  if (!roomId || !date) return NextResponse.json({ error: 'roomId en date verplicht' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('blocked_dates').upsert({
    room_id: roomId,
    date,
    reason: reason || 'manual',
  }, { onConflict: 'room_id,date' });

  if (error) return NextResponse.json({ error: 'Blokkeren mislukt' }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — datum deblokkeren
export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id verplicht' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('blocked_dates').delete().eq('id', id);

  if (error) return NextResponse.json({ error: 'Verwijderen mislukt' }, { status: 500 });
  return NextResponse.json({ success: true });
}
