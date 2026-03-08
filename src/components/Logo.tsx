'use client';

export default function Logo() {
  return (
    <img
      src="/logo.png"
      alt="Maison Aimie"
      className="h-36 md:h-44 mx-auto mb-6 drop-shadow-lg"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
