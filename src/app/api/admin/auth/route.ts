import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/auth — controleer of de gebruiker ingelogd is
export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (token === process.env.ADMIN_SECRET) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// POST /api/admin/auth — inloggen met wachtwoord
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 });
    }

    // Stel een cookie in met de geheime sleutel
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', process.env.ADMIN_SECRET!, {
      httpOnly: true,      // Niet toegankelijk via JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dagen
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Inloggen mislukt' }, { status: 500 });
  }
}

// DELETE /api/admin/auth — uitloggen
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
