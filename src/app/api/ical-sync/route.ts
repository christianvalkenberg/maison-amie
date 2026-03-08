import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// Controleer admin authenticatie
async function checkAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_SECRET;
}

// POST /api/ical-sync — sla iCal URL op voor een kamer
export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const { roomId, url } = await req.json();
    if (!roomId) return NextResponse.json({ error: 'roomId verplicht' }, { status: 400 });

    const supabase = createAdminClient();
    await supabase.from('rooms').update({ ical_url: url }).eq('id', roomId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 });
  }
}

// GET /api/ical-sync?roomId=xxx — synchroniseer iCal voor een kamer
export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  const roomId = req.nextUrl.searchParams.get('roomId');
  if (!roomId) return NextResponse.json({ error: 'roomId verplicht' }, { status: 400 });

  try {
    const supabase = createAdminClient();

    // Haal de iCal URL op voor deze kamer
    const { data: room } = await supabase
      .from('rooms')
      .select('ical_url, name_nl')
      .eq('id', roomId)
      .single();

    if (!room?.ical_url) {
      return NextResponse.json({ error: 'Geen iCal URL ingesteld voor deze suite' }, { status: 400 });
    }

    // Haal de iCal data op van de externe URL
    const icalResponse = await fetch(room.ical_url);
    if (!icalResponse.ok) {
      return NextResponse.json({ error: 'iCal URL kon niet worden opgehaald' }, { status: 400 });
    }

    const icalText = await icalResponse.text();

    // Parsen van iCal data (eenvoudige regex-based parser)
    // Voor productie: gebruik node-ical library
    const events = parseIcal(icalText);

    // Verwijder bestaande iCal-geblokkeerde datums voor deze kamer
    await supabase
      .from('blocked_dates')
      .delete()
      .eq('room_id', roomId)
      .eq('reason', 'ical');

    // Voeg nieuwe geblokkeerde datums in voor elk event
    const datesToBlock: { room_id: string; date: string; reason: string; source_id: string }[] = [];

    for (const event of events) {
      const start = new Date(event.start);
      const end = new Date(event.end);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        datesToBlock.push({
          room_id: roomId,
          date: d.toISOString().split('T')[0],
          reason: 'ical',
          source_id: event.uid,
        });
      }
    }

    // Voeg toe in batches (vermijd duplicaten)
    if (datesToBlock.length > 0) {
      await supabase.from('blocked_dates').upsert(datesToBlock, {
        onConflict: 'room_id,date',
        ignoreDuplicates: true,
      });
    }

    return NextResponse.json({ success: true, eventsFound: events.length, datesBlocked: datesToBlock.length });
  } catch (error) {
    console.error('iCal sync error:', error);
    return NextResponse.json({ error: 'Synchronisatie mislukt' }, { status: 500 });
  }
}

// Eenvoudige iCal parser voor VEVENT blokken
function parseIcal(icalText: string): { uid: string; start: string; end: string }[] {
  const events: { uid: string; start: string; end: string }[] = [];
  const eventBlocks = icalText.split('BEGIN:VEVENT');

  for (let i = 1; i < eventBlocks.length; i++) {
    const block = eventBlocks[i];
    const uid = block.match(/UID:(.+)/)?.[1]?.trim() || `event-${i}`;
    const dtstart = block.match(/DTSTART[^:]*:(\d{8})/)?.[1];
    const dtend = block.match(/DTEND[^:]*:(\d{8})/)?.[1];

    if (dtstart && dtend) {
      events.push({
        uid,
        start: `${dtstart.slice(0, 4)}-${dtstart.slice(4, 6)}-${dtstart.slice(6, 8)}`,
        end: `${dtend.slice(0, 4)}-${dtend.slice(4, 6)}-${dtend.slice(6, 8)}`,
      });
    }
  }

  return events;
}
