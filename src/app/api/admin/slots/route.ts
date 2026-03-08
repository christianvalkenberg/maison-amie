import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

function checkAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET;
}

// GET — slots ophalen voor een activiteit
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const activityId = req.nextUrl.searchParams.get('activityId');
  const supabase = createAdminClient();

  const query = supabase.from('activity_slots').select('*').order('date').order('start_time');
  if (activityId) query.eq('activity_id', activityId);

  const { data: slots } = await query;
  return NextResponse.json({ slots: slots || [] });
}

// POST — nieuw slot aanmaken
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const { activityId, date, startTime, maxParticipants } = await req.json();
  if (!activityId || !date || !startTime) {
    return NextResponse.json({ error: 'activityId, date en startTime verplicht' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('activity_slots').insert({
    activity_id: activityId,
    date,
    start_time: startTime,
    max_participants: maxParticipants || 8,
    booked_count: 0,
  });

  if (error) return NextResponse.json({ error: 'Slot aanmaken mislukt' }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — slot verwijderen
export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id verplicht' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('activity_slots').delete().eq('id', id);

  if (error) return NextResponse.json({ error: 'Verwijderen mislukt' }, { status: 500 });
  return NextResponse.json({ success: true });
}
