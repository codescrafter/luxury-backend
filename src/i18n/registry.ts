/**
 * Central Message Registry
 *
 * This is the single source of truth for all i18n translations.
 * The global exception filter imports ONLY this file — it never needs
 * to know which module a code belongs to.
 *
 * ─── Adding a new module ───────────────────────────────────────────────────
 * 1. Create src/i18n/namespaces/mymodule.namespace.ts
 * 2. Import MYMODULE_TRANSLATIONS here
 * 3. Spread it into REGISTRY
 * That's it. The filter picks it up automatically.
 *
 * ─── Lookup ───────────────────────────────────────────────────────────────
 * translate('AUTH.USER_NOT_FOUND', 'ar')  → 'المستخدم غير موجود'
 * isRegisteredCode('AUTH.USER_NOT_FOUND') → true
 * isRegisteredCode('some random string')  → false
 */

import { BilingualMessage, ErrorCode, SupportedLang } from './types';
import { AUTH_TRANSLATIONS } from './namespaces/auth.namespace';
import { COMMON_TRANSLATIONS } from './namespaces/common.namespace';
import { BOOKING_TRANSLATIONS } from './namespaces/booking.namespace';
import { PRODUCT_TRANSLATIONS } from './namespaces/product.namespace';
import { EVENT_TRANSLATIONS } from './namespaces/event.namespace';
import { NOTIFICATION_TRANSLATIONS } from './namespaces/notification.namespace';
import { PAYMENT_TRANSLATIONS } from './namespaces/payment.namespace';
import { SECURITY_GUARD_TRANSLATIONS } from './namespaces/security-guard.namespace';

/**
 * The merged translation registry.
 * O(1) lookup by error code string.
 */
const REGISTRY: Readonly<Record<ErrorCode, BilingualMessage>> = Object.freeze({
  ...AUTH_TRANSLATIONS,
  ...COMMON_TRANSLATIONS,
  ...BOOKING_TRANSLATIONS,
  ...PRODUCT_TRANSLATIONS,
  ...EVENT_TRANSLATIONS,
  ...NOTIFICATION_TRANSLATIONS,
  ...PAYMENT_TRANSLATIONS,
  ...SECURITY_GUARD_TRANSLATIONS,
});

/**
 * Checks whether a string is a registered error code.
 * Used by the exception filter to distinguish codes from freeform messages.
 *
 * A registered code must:
 *   - Contain a dot (NAMESPACE.KEY format)
 *   - Exist in the REGISTRY
 */
export function isRegisteredCode(value: string): boolean {
  return value.includes('.') && value in REGISTRY;
}

/**
 * Translates a registered error code to the requested language.
 *
 * Fallback chain:
 *   1. Exact code match in REGISTRY → return in requested lang
 *   2. Exact code match but lang missing → return English
 *   3. Code not found → return the raw code string (never crashes)
 */
export function translate(code: ErrorCode, lang: SupportedLang): string {
  const entry = REGISTRY[code];
  if (!entry) return code; // Safe fallback: return the raw code
  return entry[lang] ?? entry.en ?? code;
}

/**
 * Returns the full bilingual entry for a code, or undefined if not registered.
 * Useful for building structured responses with both languages.
 */
export function getTranslation(code: ErrorCode): BilingualMessage | undefined {
  return REGISTRY[code];
}

/**
 * Returns the raw REGISTRY for inspection (e.g. health check endpoint).
 * The registry itself is frozen and cannot be mutated.
 */
export function getRegistry(): Readonly<Record<ErrorCode, BilingualMessage>> {
  return REGISTRY;
}

// Re-export types and codes for convenience
export * from './types';
export * from './namespaces/auth.namespace';
export * from './namespaces/common.namespace';
export * from './namespaces/booking.namespace';
export * from './namespaces/product.namespace';
export * from './namespaces/event.namespace';
export * from './namespaces/notification.namespace';
export * from './namespaces/payment.namespace';
export * from './namespaces/security-guard.namespace';
