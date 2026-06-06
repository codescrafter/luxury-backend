/**
 * COMMON namespace — stable error codes for shared HTTP, JWT, and guard errors.
 *
 * Usage in guards/strategies:
 *   throw new UnauthorizedException(COMMON_CODES.UNAUTHORIZED);
 */

import { TranslationMap } from '../types';

export const COMMON_CODES = {
  // HTTP standard
  UNAUTHORIZED: 'COMMON.UNAUTHORIZED',
  FORBIDDEN: 'COMMON.FORBIDDEN',
  NOT_FOUND: 'COMMON.NOT_FOUND',
  BAD_REQUEST: 'COMMON.BAD_REQUEST',
  CONFLICT: 'COMMON.CONFLICT',
  TOO_MANY_REQUESTS: 'COMMON.TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR: 'COMMON.INTERNAL_SERVER_ERROR',

  // JWT / Session
  INVALID_TOKEN: 'COMMON.INVALID_TOKEN',
  TOKEN_EXPIRED: 'COMMON.TOKEN_EXPIRED',
  LOGIN_REQUIRED: 'COMMON.LOGIN_REQUIRED',

  // Security guard auth
  SECURITY_GUARD_AUTH_REQUIRED: 'COMMON.SECURITY_GUARD_AUTH_REQUIRED',
  INVALID_SECURITY_GUARD_TOKEN: 'COMMON.INVALID_SECURITY_GUARD_TOKEN',
} as const;

export type CommonCode = (typeof COMMON_CODES)[keyof typeof COMMON_CODES];

export const COMMON_TRANSLATIONS: TranslationMap = {
  'COMMON.UNAUTHORIZED': {
    en: 'You are not authorized to access this resource',
    ar: 'غير مصرح لك بالوصول إلى هذا المورد',
  },
  'COMMON.FORBIDDEN': {
    en: 'You do not have permission to perform this action',
    ar: 'ليس لديك إذن لتنفيذ هذا الإجراء',
  },
  'COMMON.NOT_FOUND': {
    en: 'The requested resource was not found',
    ar: 'المورد المطلوب غير موجود',
  },
  'COMMON.BAD_REQUEST': {
    en: 'Invalid request data',
    ar: 'بيانات الطلب غير صالحة',
  },
  'COMMON.CONFLICT': {
    en: 'A conflict occurred with existing data',
    ar: 'حدث تعارض مع البيانات الموجودة',
  },
  'COMMON.TOO_MANY_REQUESTS': {
    en: 'Too many requests. Please try again later.',
    ar: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً.',
  },
  'COMMON.INTERNAL_SERVER_ERROR': {
    en: 'An unexpected error occurred. Please try again.',
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  },
  'COMMON.INVALID_TOKEN': {
    en: 'Invalid or expired session. Please log in again.',
    ar: 'الجلسة غير صالحة أو منتهية الصلاحية. يرجى تسجيل الدخول مرة أخرى.',
  },
  'COMMON.TOKEN_EXPIRED': {
    en: 'Your session has expired. Please log in again.',
    ar: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
  },
  'COMMON.LOGIN_REQUIRED': {
    en: 'Please log in to access this resource',
    ar: 'يرجى تسجيل الدخول للوصول إلى هذا المورد',
  },
  'COMMON.SECURITY_GUARD_AUTH_REQUIRED': {
    en: 'Security guard authentication is required',
    ar: 'مطلوب مصادقة حارس الأمن',
  },
  'COMMON.INVALID_SECURITY_GUARD_TOKEN': {
    en: 'Invalid token type for security guard',
    ar: 'نوع الرمز غير صالح لحارس الأمن',
  },
};
