import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Maison Amie',
};

// Admin layout — geen navigatie of footer van de publiekssite
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {children}
    </div>
  );
}
