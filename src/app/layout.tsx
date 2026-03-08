import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import './globals.css';

// Lettertypen laden via Google Fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maison Amie — B&B near Revel, South France',
  description:
    'A beautiful country house near Revel in South France. Six unique suites, a lush garden and unforgettable experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={`${playfair.variable} ${lato.variable} font-body bg-cream text-dark`}>
        {children}
      </body>
    </html>
  );
}
