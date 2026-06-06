/**
 * SECURITY_GUARD namespace — stable error codes for the SecurityGuard module.
 */

import { TranslationMap } from '../types';

export const SECURITY_GUARD_CODES = {
  NOT_FOUND: 'SECURITY_GUARD.NOT_FOUND',
  UNAUTHORIZED: 'SECURITY_GUARD.UNAUTHORIZED',
  ACCOUNT_INACTIVE: 'SECURITY_GUARD.ACCOUNT_INACTIVE',
  INVALID_CREDENTIALS: 'SECURITY_GUARD.INVALID_CREDENTIALS',
  USERNAME_TAKEN: 'SECURITY_GUARD.USERNAME_TAKEN',
  EMAIL_TAKEN: 'SECURITY_GUARD.EMAIL_TAKEN',
  PHONE_TAKEN: 'SECURITY_GUARD.PHONE_TAKEN',
  PARTNER_NOT_FOUND: 'SECURITY_GUARD.PARTNER_NOT_FOUND',
  EMAIL_SEND_FAILED: 'SECURITY_GUARD.EMAIL_SEND_FAILED',
  SMS_SEND_FAILED: 'SECURITY_GUARD.SMS_SEND_FAILED',
} as const;

export type SecurityGuardCode =
  (typeof SECURITY_GUARD_CODES)[keyof typeof SECURITY_GUARD_CODES];

export const SECURITY_GUARD_TRANSLATIONS: TranslationMap = {
  'SECURITY_GUARD.NOT_FOUND': {
    en: 'Security guard not found',
    ar: 'حارس الأمن غير موجود',
  },
  'SECURITY_GUARD.UNAUTHORIZED': {
    en: 'You are not authorized to manage this security guard',
    ar: 'غير مصرح لك بإدارة حارس الأمن هذا',
  },
  'SECURITY_GUARD.ACCOUNT_INACTIVE': {
    en: 'Security guard account is not active',
    ar: 'حساب حارس الأمن غير نشط',
  },
  'SECURITY_GUARD.INVALID_CREDENTIALS': {
    en: 'Invalid username or password',
    ar: 'اسم المستخدم أو كلمة المرور غير صحيحة',
  },
  'SECURITY_GUARD.USERNAME_TAKEN': {
    en: 'This username is already taken',
    ar: 'اسم المستخدم هذا مستخدم بالفعل',
  },
  'SECURITY_GUARD.EMAIL_TAKEN': {
    en: 'This email address is already registered',
    ar: 'عنوان البريد الإلكتروني هذا مسجل بالفعل',
  },
  'SECURITY_GUARD.PHONE_TAKEN': {
    en: 'This phone number is already registered',
    ar: 'رقم الهاتف هذا مسجل بالفعل',
  },
  'SECURITY_GUARD.PARTNER_NOT_FOUND': {
    en: 'Partner account not found',
    ar: 'حساب الشريك غير موجود',
  },
  'SECURITY_GUARD.EMAIL_SEND_FAILED': {
    en: 'Failed to send credentials email. Please try again.',
    ar: 'فشل إرسال بريد إلكتروني ببيانات الدخول. يرجى المحاولة مرة أخرى.',
  },
  'SECURITY_GUARD.SMS_SEND_FAILED': {
    en: 'Failed to send credentials SMS. Please try again.',
    ar: 'فشل إرسال رسالة SMS ببيانات الدخول. يرجى المحاولة مرة أخرى.',
  },
};
