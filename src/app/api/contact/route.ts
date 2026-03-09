import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { rateLimit, getIp } from '@/lib/ratelimit';
import { contactSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    // Max 5 berichten per uur per IP
    const ip = getIp(req);
    if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }, { status: 429 });
    }

    const body = await req.json();
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    const { name, email, phone, subject, message } = result.data;

    await sendContactEmail({ name, email, phone, subject, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'E-mail versturen mislukt' }, { status: 500 });
  }
}
