// Eenvoudige in-memory rate limiter
// Werkt per server-instantie — voldoende voor een kleine website

const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Controleert of een verzoek toegestaan is.
 * @param key      Unieke sleutel, bijv. IP-adres + route
 * @param max      Maximaal aantal verzoeken per tijdvenster
 * @param windowMs Tijdvenster in milliseconden
 * @returns true als toegestaan, false als geblokkeerd
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= max) {
    return false;
  }

  record.count++;
  return true;
}

/** Haal het IP-adres op uit het verzoek */
export function getIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? 'unknown';
}
