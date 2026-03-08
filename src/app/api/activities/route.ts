import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// GET /api/activities — alle activiteiten ophalen
// GET /api/activities?activityId=xxx&date=2024-07-01 — slots voor die dag
export async function GET(req: NextRequest) {
  const activityId = req.nextUrl.searchParams.get('activityId');
  const date = req.nextUrl.searchParams.get('date');
  const supabase = createAdminClient();

  try {
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .order('created_at');

    // Als er ook een activityId en datum zijn, geef ook de slots terug
    if (activityId && date) {
      const { data: slots } = await supabase
        .from('activity_slots')
        .select('*')
        .eq('activity_id', activityId)
        .eq('date', date)
        .order('start_time');

      return NextResponse.json({ activities: activities || [], slots: slots || [] });
    }

    return NextResponse.json({ activities: activities || [] });
  } catch (error) {
    console.error('Activities API error:', error);
    return NextResponse.json({ error: 'Fout bij ophalen activiteiten' }, { status: 500 });
  }
}
