/**
 * Language resolution utility.
 *
 * Determines the active language for a request using a priority chain:
 *   1. req.user.lang    — from JWT (most authoritative, authenticated routes)
 *   2. ?lang=           — query param (explicit per-request override)
 *   3. Accept-Language  — HTTP header (browser/client preference)
 *   4. 'en'             — hard default
 *
 * This is intentionally a plain function (not a NestJS service) so it can be
 * used both inside NestJS context (exception filters, pipes) and outside it.
 */

export type SupportedLang = 'en' | 'ar';

const SUPPORTED_LANGS: SupportedLang[] = ['en', 'ar'];

/**
 * Normalizes a raw lang string to a supported locale, with fallback to 'en'.
 */
function normalizeLang(raw: string | undefined): SupportedLang {
  if (!raw) return 'en';
  const lower = raw.toLowerCase().trim();
  // Handle full locale codes like "ar-SA", "en-US"
  const base = lower.split('-')[0] as SupportedLang;
  return SUPPORTED_LANGS.includes(base) ? base : 'en';
}

/**
 * Resolves the active language from an Express-compatible request object.
 * Works inside exception filters and interceptors where req is available.
 */
export function resolveLang(req: Record<string, any>): SupportedLang {
  // 1. JWT-derived user language (most authoritative)
  if (req?.user?.lang) {
    return normalizeLang(req.user.lang);
  }

  // 2. Explicit query param override (?lang=ar)
  if (req?.query?.lang) {
    return normalizeLang(req.query.lang as string);
  }

  // 3. Accept-Language header (browser/mobile client preference)
  const acceptLanguage = req?.headers?.['accept-language'];
  if (acceptLanguage) {
    // Accept-Language can be: "ar,en;q=0.9" or "ar-SA,ar;q=0.9"
    const primary = acceptLanguage.split(',')[0];
    return normalizeLang(primary);
  }

  // 4. Default
  return 'en';
}

/**
 * Translates a bilingual message object to the active language.
 * Falls back to English if the lang key is not found.
 */
export function translateMessage(
  message: { en: string; ar: string } | undefined,
  lang: SupportedLang,
): string {
  if (!message) return '';
  return message[lang] ?? message.en;
}
