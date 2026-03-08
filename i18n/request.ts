import { getRequestConfig } from 'next-intl/server';

const locales = ['nl', 'fr', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Haal locale op uit de URL (bijv. /nl, /fr, /en)
  let locale = await requestLocale;

  // Fallback naar 'nl' als de locale niet geldig of leeg is
  if (!locale || !locales.includes(locale)) {
    locale = 'nl';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
