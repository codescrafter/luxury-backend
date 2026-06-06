/**
 * AUTH namespace — stable error codes and their bilingual translations.
 *
 * Usage in services:
 *   throw new NotFoundException(AUTH_CODES.USER_NOT_FOUND);
 *
 * The global exception filter resolves codes via the central registry.
 * Never reference .en or .ar directly in business logic.
 */

import { TranslationMap } from '../types';

// ─── Stable error codes ────────────────────────────────────────────────────────
// These are the strings thrown as exception messages in auth.service.ts
// and other auth-related files. They MUST match the keys in AUTH_TRANSLATIONS.

export const AUTH_CODES = {
  // User existence
  USER_NOT_FOUND: 'AUTH.USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'AUTH.USER_ALREADY_EXISTS',
  USER_VERIFICATION_NOT_FOUND: 'AUTH.USER_VERIFICATION_NOT_FOUND',

  // Credentials / Login
  INVALID_CREDENTIALS: 'AUTH.INVALID_CREDENTIALS',
  INVALID_PASSWORD: 'AUTH.INVALID_PASSWORD',
  WRONG_SIGN_IN_METHOD: 'AUTH.WRONG_SIGN_IN_METHOD',
  INVALID_GOOGLE_TOKEN: 'AUTH.INVALID_GOOGLE_TOKEN',

  // Signup / Account status
  SIGNUP_NOT_COMPLETED: 'AUTH.SIGNUP_NOT_COMPLETED',
  ACCOUNT_INACTIVE: 'AUTH.ACCOUNT_INACTIVE',

  // OTP / Verification codes
  INVALID_EMAIL_CODE: 'AUTH.INVALID_EMAIL_CODE',
  INVALID_PHONE_CODE: 'AUTH.INVALID_PHONE_CODE',
  EMAIL_CODE_EXPIRED: 'AUTH.EMAIL_CODE_EXPIRED',
  PHONE_CODE_EXPIRED: 'AUTH.PHONE_CODE_EXPIRED',
  EMAIL_CODE_ALREADY_SENT: 'AUTH.EMAIL_CODE_ALREADY_SENT',
  PHONE_CODE_ALREADY_SENT: 'AUTH.PHONE_CODE_ALREADY_SENT',
  INVALID_PASSWORD_RESET_CODE: 'AUTH.INVALID_PASSWORD_RESET_CODE',
  PASSWORD_RESET_CODE_EXPIRED: 'AUTH.PASSWORD_RESET_CODE_EXPIRED',
  PASSWORD_RESET_NOT_AVAILABLE: 'AUTH.PASSWORD_RESET_NOT_AVAILABLE',

  // Email / Phone conflicts
  EMAIL_ALREADY_IN_USE: 'AUTH.EMAIL_ALREADY_IN_USE',
  PHONE_ALREADY_IN_USE: 'AUTH.PHONE_ALREADY_IN_USE',

  // Email / SMS sending
  EMAIL_SEND_FAILED: 'AUTH.EMAIL_SEND_FAILED',
  SMS_SEND_FAILED: 'AUTH.SMS_SEND_FAILED',

  // Partner application
  PARTNER_APPLICATION_ALREADY_SUBMITTED: 'AUTH.PARTNER_APPLICATION_ALREADY_SUBMITTED',
  PARTNER_APPLICATION_NOT_FOUND: 'AUTH.PARTNER_APPLICATION_NOT_FOUND',
  USER_ALREADY_PARTNER: 'AUTH.USER_ALREADY_PARTNER',

  // Security guard
  SECURITY_GUARD_NOT_FOUND: 'AUTH.SECURITY_GUARD_NOT_FOUND',
  SECURITY_GUARD_INACTIVE: 'AUTH.SECURITY_GUARD_INACTIVE',

  // Validation (used as DTO message options)
  VALIDATION_FAILED: 'AUTH.VALIDATION_FAILED',
  FIELD_REQUIRED: 'AUTH.FIELD_REQUIRED',
  INVALID_EMAIL_FORMAT: 'AUTH.INVALID_EMAIL_FORMAT',
  INVALID_PHONE_FORMAT: 'AUTH.INVALID_PHONE_FORMAT',
  INVALID_EMAIL_OR_PHONE: 'AUTH.INVALID_EMAIL_OR_PHONE',
  PASSWORD_TOO_SHORT: 'AUTH.PASSWORD_TOO_SHORT',
  CODE_INVALID_LENGTH: 'AUTH.CODE_INVALID_LENGTH',

  // ─── Success / info message codes (returned by service, translated in controller) ──
  PASSWORD_RESET_CODE_SENT_EMAIL: 'AUTH.PASSWORD_RESET_CODE_SENT_EMAIL',
  PASSWORD_RESET_CODE_SENT_PHONE: 'AUTH.PASSWORD_RESET_CODE_SENT_PHONE',
  PASSWORD_RESET_SUCCESS: 'AUTH.PASSWORD_RESET_SUCCESS',
  SIGNUP_REQUEST_SENT: 'AUTH.SIGNUP_REQUEST_SENT',
  ACCOUNT_VERIFIED: 'AUTH.ACCOUNT_VERIFIED',
  EMAIL_CODE_SENT: 'AUTH.EMAIL_CODE_SENT',
  PHONE_CODE_SENT: 'AUTH.PHONE_CODE_SENT',
  SIGNUP_CODES_RESENT: 'AUTH.SIGNUP_CODES_RESENT',
  USER_UPDATED: 'AUTH.USER_UPDATED',
  PARTNER_APPLICATION_SUBMITTED: 'AUTH.PARTNER_APPLICATION_SUBMITTED',
  PARTNER_APPLICATION_REJECTED: 'AUTH.PARTNER_APPLICATION_REJECTED',
  PARTNER_APPLICATION_APPROVED: 'AUTH.PARTNER_APPLICATION_APPROVED',
} as const;

export type AuthCode = (typeof AUTH_CODES)[keyof typeof AUTH_CODES];

// ─── Translations ──────────────────────────────────────────────────────────────

export const AUTH_TRANSLATIONS: TranslationMap = {
  // User existence
  'AUTH.USER_NOT_FOUND': {
    en: 'User not found',
    ar: 'المستخدم غير موجود',
  },
  'AUTH.USER_ALREADY_EXISTS': {
    en: 'User already exists',
    ar: 'المستخدم موجود بالفعل',
  },
  'AUTH.USER_VERIFICATION_NOT_FOUND': {
    en: 'User verification record not found',
    ar: 'سجل التحقق من المستخدم غير موجود',
  },

  // Credentials / Login
  'AUTH.INVALID_CREDENTIALS': {
    en: 'Invalid credentials',
    ar: 'بيانات الاعتماد غير صحيحة',
  },
  'AUTH.INVALID_PASSWORD': {
    en: 'Invalid password',
    ar: 'كلمة المرور غير صحيحة',
  },
  'AUTH.WRONG_SIGN_IN_METHOD': {
    en: 'This account was created using a different sign-in method. Please use the appropriate login method.',
    ar: 'تم إنشاء هذا الحساب باستخدام طريقة تسجيل دخول مختلفة. يرجى استخدام طريقة تسجيل الدخول المناسبة.',
  },
  'AUTH.INVALID_GOOGLE_TOKEN': {
    en: 'Invalid Google token',
    ar: 'رمز جوجل غير صحيح',
  },

  // Signup / Account status
  'AUTH.SIGNUP_NOT_COMPLETED': {
    en: 'Please complete your signup before continuing',
    ar: 'يرجى إكمال التسجيل قبل المتابعة',
  },
  'AUTH.ACCOUNT_INACTIVE': {
    en: 'Your account is not active',
    ar: 'حسابك غير نشط',
  },

  // OTP / Verification codes
  'AUTH.INVALID_EMAIL_CODE': {
    en: 'Invalid email verification code',
    ar: 'رمز التحقق بالبريد الإلكتروني غير صحيح',
  },
  'AUTH.INVALID_PHONE_CODE': {
    en: 'Invalid phone verification code',
    ar: 'رمز التحقق بالهاتف غير صحيح',
  },
  'AUTH.EMAIL_CODE_EXPIRED': {
    en: 'Email verification code has expired',
    ar: 'انتهت صلاحية رمز التحقق بالبريد الإلكتروني',
  },
  'AUTH.PHONE_CODE_EXPIRED': {
    en: 'Phone verification code has expired',
    ar: 'انتهت صلاحية رمز التحقق بالهاتف',
  },
  'AUTH.EMAIL_CODE_ALREADY_SENT': {
    en: 'Email verification code was already sent. Please wait before requesting again.',
    ar: 'تم إرسال رمز التحقق بالبريد الإلكتروني بالفعل. يرجى الانتظار قبل الطلب مرة أخرى.',
  },
  'AUTH.PHONE_CODE_ALREADY_SENT': {
    en: 'Phone verification code was already sent. Please wait before requesting again.',
    ar: 'تم إرسال رمز التحقق بالهاتف بالفعل. يرجى الانتظار قبل الطلب مرة أخرى.',
  },
  'AUTH.INVALID_PASSWORD_RESET_CODE': {
    en: 'Invalid password reset code',
    ar: 'رمز إعادة تعيين كلمة المرور غير صحيح',
  },
  'AUTH.PASSWORD_RESET_CODE_EXPIRED': {
    en: 'Password reset code has expired',
    ar: 'انتهت صلاحية رمز إعادة تعيين كلمة المرور',
  },
  'AUTH.PASSWORD_RESET_NOT_AVAILABLE': {
    en: 'Password reset is not available for this sign-in method',
    ar: 'إعادة تعيين كلمة المرور غير متاحة لطريقة تسجيل الدخول هذه',
  },

  // Email / Phone conflicts
  'AUTH.EMAIL_ALREADY_IN_USE': {
    en: 'This email address is already in use',
    ar: 'عنوان البريد الإلكتروني هذا مستخدم بالفعل',
  },
  'AUTH.PHONE_ALREADY_IN_USE': {
    en: 'This phone number is already in use',
    ar: 'رقم الهاتف هذا مستخدم بالفعل',
  },

  // Sending failures
  'AUTH.EMAIL_SEND_FAILED': {
    en: 'Failed to send verification email. Please try again.',
    ar: 'فشل إرسال البريد الإلكتروني للتحقق. يرجى المحاولة مرة أخرى.',
  },
  'AUTH.SMS_SEND_FAILED': {
    en: 'Failed to send SMS. Please try again.',
    ar: 'فشل إرسال الرسالة النصية. يرجى المحاولة مرة أخرى.',
  },

  // Partner application
  'AUTH.PARTNER_APPLICATION_ALREADY_SUBMITTED': {
    en: 'You have already submitted a partner application',
    ar: 'لقد قدمت طلب شراكة بالفعل',
  },
  'AUTH.PARTNER_APPLICATION_NOT_FOUND': {
    en: 'Partner application not found',
    ar: 'طلب الشراكة غير موجود',
  },
  'AUTH.USER_ALREADY_PARTNER': {
    en: 'User is already a partner',
    ar: 'المستخدم شريك بالفعل',
  },

  // Security guard
  'AUTH.SECURITY_GUARD_NOT_FOUND': {
    en: 'Security guard not found',
    ar: 'حارس الأمن غير موجود',
  },
  'AUTH.SECURITY_GUARD_INACTIVE': {
    en: 'Security guard account is not active',
    ar: 'حساب حارس الأمن غير نشط',
  },

  // Validation
  'AUTH.VALIDATION_FAILED': {
    en: 'Invalid input data',
    ar: 'بيانات الإدخال غير صالحة',
  },
  'AUTH.FIELD_REQUIRED': {
    en: 'This field is required',
    ar: 'هذا الحقل مطلوب',
  },
  'AUTH.INVALID_EMAIL_FORMAT': {
    en: 'Please enter a valid email address',
    ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
  },
  'AUTH.INVALID_PHONE_FORMAT': {
    en: 'Please enter a valid phone number with country code',
    ar: 'يرجى إدخال رقم هاتف صحيح مع رمز الدولة',
  },
  'AUTH.INVALID_EMAIL_OR_PHONE': {
    en: 'Please enter a valid email address or phone number',
    ar: 'يرجى إدخال عنوان بريد إلكتروني أو رقم هاتف صحيح',
  },
  'AUTH.PASSWORD_TOO_SHORT': {
    en: 'Password must be at least 6 characters long',
    ar: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
  },
  'AUTH.CODE_INVALID_LENGTH': {
    en: 'Verification code must be exactly 6 digits',
    ar: 'يجب أن يكون رمز التحقق 6 أرقام بالضبط',
  },

  // ─── Success / info messages ─────────────────────────────────────────────────
  'AUTH.PASSWORD_RESET_CODE_SENT_EMAIL': {
    en: 'Password reset code sent to your email.',
    ar: 'تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
  },
  'AUTH.PASSWORD_RESET_CODE_SENT_PHONE': {
    en: 'Password reset code sent to your phone.',
    ar: 'تم إرسال رمز إعادة تعيين كلمة المرور إلى هاتفك.',
  },
  'AUTH.PASSWORD_RESET_SUCCESS': {
    en: 'Password reset successfully.',
    ar: 'تم إعادة تعيين كلمة المرور بنجاح.',
  },
  'AUTH.SIGNUP_REQUEST_SENT': {
    en: 'Signup request sent. Please check your email and phone for verification codes.',
    ar: 'تم إرسال طلب التسجيل. يرجى التحقق من بريدك الإلكتروني وهاتفك للحصول على رموز التحقق.',
  },
  'AUTH.ACCOUNT_VERIFIED': {
    en: 'Account verified successfully.',
    ar: 'تم التحقق من الحساب بنجاح.',
  },
  'AUTH.EMAIL_CODE_SENT': {
    en: 'Email verification code sent.',
    ar: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.',
  },
  'AUTH.PHONE_CODE_SENT': {
    en: 'Phone verification code sent.',
    ar: 'تم إرسال رمز التحقق إلى هاتفك.',
  },
  'AUTH.SIGNUP_CODES_RESENT': {
    en: 'Verification codes resent to your email and phone.',
    ar: 'تمت إعادة إرسال رموز التحقق إلى بريدك الإلكتروني وهاتفك.',
  },
  'AUTH.USER_UPDATED': {
    en: 'Profile updated successfully.',
    ar: 'تم تحديث الملف الشخصي بنجاح.',
  },
  'AUTH.PARTNER_APPLICATION_SUBMITTED': {
    en: 'Partner application submitted successfully.',
    ar: 'تم تقديم طلب الشراكة بنجاح.',
  },
  'AUTH.PARTNER_APPLICATION_REJECTED': {
    en: 'Partner application rejected.',
    ar: 'تم رفض طلب الشراكة.',
  },
  'AUTH.PARTNER_APPLICATION_APPROVED': {
    en: 'Partner application approved.',
    ar: 'تمت الموافقة على طلب الشراكة.',
  },
};
