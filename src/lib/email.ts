import nodemailer from 'nodemailer';

// E-mail transporter via SMTP
// Configureer in .env.local met SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Stuur bevestigingsmail naar gast na reserveringsverzoek
export async function sendBookingConfirmationToGuest(booking: {
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  await transporter.sendMail({
    from: `Maison Amie <${process.env.EMAIL_FROM}>`,
    to: booking.guestEmail,
    subject: 'Reserveringsverzoek ontvangen — Maison Amie',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2C2417;">
        <h1 style="color: #C1694F;">Maison Amie</h1>
        <p>Beste ${booking.guestName},</p>
        <p>We hebben uw reserveringsverzoek ontvangen en nemen binnen 24 uur contact met u op ter bevestiging.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Suite</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.roomName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Aankomst</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.checkIn}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Vertrek</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.checkOut}</td></tr>
          <tr><td style="padding: 8px;"><strong>Gasten</strong></td><td style="padding: 8px;">${booking.guests}</td></tr>
        </table>
        <p>Met vriendelijke groet,<br>Het team van Maison Amie</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Maison Amie · Nabij Revel, Zuid-Frankrijk · info@maisonamie.fr</p>
      </div>
    `,
  });
}

// Stuur melding aan eigenaar bij nieuw reserveringsverzoek
export async function sendBookingNotificationToHost(booking: {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
}) {
  await transporter.sendMail({
    from: `Maison Amie <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `Nieuw reserveringsverzoek van ${booking.guestName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nieuw reserveringsverzoek</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Naam</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.guestName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>E-mail</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.guestEmail}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Telefoon</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.guestPhone || '—'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Suite</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.roomName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Aankomst</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.checkIn}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Vertrek</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.checkOut}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Gasten</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.guests}</td></tr>
          <tr><td style="padding: 8px;"><strong>Bericht</strong></td><td style="padding: 8px;">${booking.message || '—'}</td></tr>
        </table>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin">Beheer via het admin paneel</a></p>
      </div>
    `,
  });
}

// Stuur bevestigingsmail voor contactformulier
export async function sendContactEmail(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `Maison Amie <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    replyTo: contact.email,
    subject: `Contact: ${contact.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nieuw contactbericht</h2>
        <p><strong>Van:</strong> ${contact.name} (${contact.email})</p>
        ${contact.phone ? `<p><strong>Telefoon:</strong> ${contact.phone}</p>` : ''}
        <p><strong>Onderwerp:</strong> ${contact.subject}</p>
        <hr>
        <p>${contact.message.replace(/\n/g, '<br>')}</p>
      </div>
    `,
  });
}
