/**
 * Shared i18n types used across all message namespaces and the registry.
 *
 * Keeping types in a single file prevents duplication across namespace files
 * and makes it easy to extend (e.g. adding 'fr' later).
 */

/** The set of languages this application supports. */
export type SupportedLang = 'en' | 'ar';

/** A translation entry containing the message in every supported language. */
export type BilingualMessage = {
  readonly en: string;
  readonly ar: string;
};

/**
 * A stable dot-notation error code string.
 * Format: `NAMESPACE.ERROR_KEY`
 * Examples: `AUTH.USER_NOT_FOUND`, `COMMON.UNAUTHORIZED`, `BOOKING.NOT_FOUND`
 *
 * These are the values thrown as exception messages in services.
 * The global exception filter resolves them to localized strings at runtime.
 */
export type ErrorCode = string;

/** A map of ErrorCode → BilingualMessage. Used by each namespace. */
export type TranslationMap = Record<ErrorCode, BilingualMessage>;
