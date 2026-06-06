/**
 * PRODUCT namespace — stable error codes and translations for the Products module.
 *
 * Covers all product types: jetski, kayak, yacht, speedboat, resort.
 * Also covers bookings, unavailability, QR codes, and media uploads
 * since these all live in the Products module.
 *
 * Usage in services:
 *   throw new NotFoundException(PRODUCT_CODES.NOT_FOUND);
 *   throw new ForbiddenException(PRODUCT_CODES.UNAUTHORIZED);
 */

import { TranslationMap } from '../types';

export const PRODUCT_CODES = {
  // ─── General product errors ──────────────────────────────────────────────
  NOT_FOUND: 'PRODUCT.NOT_FOUND',
  UNAUTHORIZED: 'PRODUCT.UNAUTHORIZED',
  INVALID_TYPE: 'PRODUCT.INVALID_TYPE',
  INVALID_ACTION: 'PRODUCT.INVALID_ACTION',
  ALREADY_APPROVED: 'PRODUCT.ALREADY_APPROVED',
  NOT_APPROVED: 'PRODUCT.NOT_APPROVED',

  // ─── Media upload errors ─────────────────────────────────────────────────
  IMAGE_UPLOAD_FAILED: 'PRODUCT.IMAGE_UPLOAD_FAILED',
  VIDEO_UPLOAD_FAILED: 'PRODUCT.VIDEO_UPLOAD_FAILED',

  // ─── Unavailability errors ───────────────────────────────────────────────
  INVALID_START_TIME: 'PRODUCT.INVALID_START_TIME',
  INVALID_END_TIME: 'PRODUCT.INVALID_END_TIME',
  INVALID_TIME_RANGE: 'PRODUCT.INVALID_TIME_RANGE',
  TIME_IN_PAST: 'PRODUCT.TIME_IN_PAST',
  UNAVAILABILITY_OVERLAP: 'PRODUCT.UNAVAILABILITY_OVERLAP',

  // ─── Booking errors ──────────────────────────────────────────────────────
  BOOKING_NOT_FOUND: 'PRODUCT.BOOKING_NOT_FOUND',
  BOOKING_UNAUTHORIZED: 'PRODUCT.BOOKING_UNAUTHORIZED',
  BOOKING_UNAVAILABLE: 'PRODUCT.BOOKING_UNAVAILABLE',
  BOOKING_ALREADY_BOOKED: 'PRODUCT.BOOKING_ALREADY_BOOKED',
  BOOKING_IN_PAST: 'PRODUCT.BOOKING_IN_PAST',
  BOOKING_NOT_PENDING: 'PRODUCT.BOOKING_NOT_PENDING',
  BOOKING_NOT_CONFIRMED: 'PRODUCT.BOOKING_NOT_CONFIRMED',
  BOOKING_ALREADY_CANCELLED: 'PRODUCT.BOOKING_ALREADY_CANCELLED',
  BOOKING_CANNOT_CANCEL: 'PRODUCT.BOOKING_CANNOT_CANCEL',
  BOOKING_PAYMENT_ALREADY_CONFIRMED: 'PRODUCT.BOOKING_PAYMENT_ALREADY_CONFIRMED',

  // ─── Pricing errors ──────────────────────────────────────────────────────
  NO_PRICING_INFO: 'PRODUCT.NO_PRICING_INFO',
  PRICE_MISMATCH: 'PRODUCT.PRICE_MISMATCH',
  MIN_BOOKING_DURATION: 'PRODUCT.MIN_BOOKING_DURATION',

  // ─── QR code errors ──────────────────────────────────────────────────────
  QR_NOT_FOUND: 'PRODUCT.QR_NOT_FOUND',
  QR_INVALID: 'PRODUCT.QR_INVALID',
  QR_ALREADY_USED: 'PRODUCT.QR_ALREADY_USED',
  QR_EXPIRED: 'PRODUCT.QR_EXPIRED',
  QR_ALREADY_EXISTS: 'PRODUCT.QR_ALREADY_EXISTS',
  QR_GENERATE_FAILED: 'PRODUCT.QR_GENERATE_FAILED',
  QR_VERIFY_FAILED: 'PRODUCT.QR_VERIFY_FAILED',
  QR_FETCH_FAILED: 'PRODUCT.QR_FETCH_FAILED',
  QR_NOT_FOR_CONFIRMED: 'PRODUCT.QR_NOT_FOR_CONFIRMED',

  // ─── Validation (for DTO message options) ────────────────────────────────────
  VALIDATION_FAILED: 'PRODUCT.VALIDATION_FAILED',
  FIELD_REQUIRED: 'PRODUCT.FIELD_REQUIRED',
  INVALID_DATE: 'PRODUCT.INVALID_DATE',
  INVALID_COORDINATES: 'PRODUCT.INVALID_COORDINATES',
  INVALID_CAPACITY: 'PRODUCT.INVALID_CAPACITY',
  INVALID_EMAIL: 'PRODUCT.INVALID_EMAIL',
  INVALID_PHONE: 'PRODUCT.INVALID_PHONE',

  // ─── Success / info message codes (returned by service, translated in controller) ──
  QR_NO_BOOKINGS_FOUND: 'PRODUCT.QR_NO_BOOKINGS_FOUND',
  QR_MARKED_EXPIRED: 'PRODUCT.QR_MARKED_EXPIRED',
  QR_CLEANUP_DONE: 'PRODUCT.QR_CLEANUP_DONE',
  NOTIFICATION_MARKED_READ: 'PRODUCT.NOTIFICATION_MARKED_READ',
  NOTIFICATIONS_MARKED_READ: 'PRODUCT.NOTIFICATIONS_MARKED_READ',
} as const;

export type ProductCode = (typeof PRODUCT_CODES)[keyof typeof PRODUCT_CODES];

// ─── Translations ────────────────────────────────────────────────────────────

export const PRODUCT_TRANSLATIONS: TranslationMap = {
  // General
  'PRODUCT.NOT_FOUND': {
    en: 'Product not found',
    ar: 'المنتج غير موجود',
  },
  'PRODUCT.UNAUTHORIZED': {
    en: 'You are not authorized to manage this product',
    ar: 'غير مصرح لك بإدارة هذا المنتج',
  },
  'PRODUCT.INVALID_TYPE': {
    en: 'Invalid product type',
    ar: 'نوع المنتج غير صالح',
  },
  'PRODUCT.INVALID_ACTION': {
    en: 'Invalid action',
    ar: 'الإجراء غير صالح',
  },
  'PRODUCT.ALREADY_APPROVED': {
    en: 'This product is already approved',
    ar: 'تمت الموافقة على هذا المنتج بالفعل',
  },
  'PRODUCT.NOT_APPROVED': {
    en: 'This product has not been approved yet',
    ar: 'لم تتم الموافقة على هذا المنتج بعد',
  },

  // Media upload
  'PRODUCT.IMAGE_UPLOAD_FAILED': {
    en: 'Failed to upload image. Please try again.',
    ar: 'فشل تحميل الصورة. يرجى المحاولة مرة أخرى.',
  },
  'PRODUCT.VIDEO_UPLOAD_FAILED': {
    en: 'Failed to upload video. Please try again.',
    ar: 'فشل تحميل الفيديو. يرجى المحاولة مرة أخرى.',
  },

  // Unavailability
  'PRODUCT.INVALID_START_TIME': {
    en: 'Invalid start time',
    ar: 'وقت البدء غير صالح',
  },
  'PRODUCT.INVALID_END_TIME': {
    en: 'Invalid end time',
    ar: 'وقت الانتهاء غير صالح',
  },
  'PRODUCT.INVALID_TIME_RANGE': {
    en: 'Start time must be before end time',
    ar: 'يجب أن يكون وقت البدء قبل وقت الانتهاء',
  },
  'PRODUCT.TIME_IN_PAST': {
    en: 'Cannot set a time in the past',
    ar: 'لا يمكن تحديد وقت في الماضي',
  },
  'PRODUCT.UNAVAILABILITY_OVERLAP': {
    en: 'Unavailability already exists for this time range',
    ar: 'يوجد تعارض في التوفر لهذا النطاق الزمني',
  },

  // Booking
  'PRODUCT.BOOKING_NOT_FOUND': {
    en: 'Booking not found',
    ar: 'الحجز غير موجود',
  },
  'PRODUCT.BOOKING_UNAUTHORIZED': {
    en: 'You are not authorized to manage this booking',
    ar: 'غير مصرح لك بإدارة هذا الحجز',
  },
  'PRODUCT.BOOKING_UNAVAILABLE': {
    en: 'This product is unavailable for the selected time range',
    ar: 'هذا المنتج غير متاح للنطاق الزمني المحدد',
  },
  'PRODUCT.BOOKING_ALREADY_BOOKED': {
    en: 'This product is already booked for the selected time range',
    ar: 'هذا المنتج محجوز بالفعل للنطاق الزمني المحدد',
  },
  'PRODUCT.BOOKING_IN_PAST': {
    en: 'Cannot create a booking in the past',
    ar: 'لا يمكن إنشاء حجز في الماضي',
  },
  'PRODUCT.BOOKING_NOT_PENDING': {
    en: 'Only pending bookings can be updated',
    ar: 'يمكن تحديث الحجوزات المعلقة فقط',
  },
  'PRODUCT.BOOKING_NOT_CONFIRMED': {
    en: 'Only confirmed bookings can be completed',
    ar: 'يمكن إكمال الحجوزات المؤكدة فقط',
  },
  'PRODUCT.BOOKING_ALREADY_CANCELLED': {
    en: 'This booking is already cancelled',
    ar: 'تم إلغاء هذا الحجز بالفعل',
  },
  'PRODUCT.BOOKING_CANNOT_CANCEL': {
    en: 'This booking cannot be cancelled',
    ar: 'لا يمكن إلغاء هذا الحجز',
  },
  'PRODUCT.BOOKING_PAYMENT_ALREADY_CONFIRMED': {
    en: 'Payment has already been confirmed for this booking',
    ar: 'تم تأكيد الدفع لهذا الحجز بالفعل',
  },

  // Pricing
  'PRODUCT.NO_PRICING_INFO': {
    en: 'This product does not have pricing information',
    ar: 'لا تتوفر معلومات تسعير لهذا المنتج',
  },
  'PRODUCT.PRICE_MISMATCH': {
    en: 'The total price does not match the expected price',
    ar: 'السعر الإجمالي لا يتطابق مع السعر المتوقع',
  },
  'PRODUCT.MIN_BOOKING_DURATION': {
    en: 'Minimum booking duration is 30 minutes',
    ar: 'الحد الأدنى لمدة الحجز هو 30 دقيقة',
  },

  // QR codes
  'PRODUCT.QR_NOT_FOUND': {
    en: 'QR code not found',
    ar: 'رمز الاستجابة السريعة غير موجود',
  },
  'PRODUCT.QR_INVALID': {
    en: 'Invalid QR code',
    ar: 'رمز الاستجابة السريعة غير صالح',
  },
  'PRODUCT.QR_ALREADY_USED': {
    en: 'This QR code has already been redeemed',
    ar: 'تم استخدام رمز الاستجابة السريعة هذا بالفعل',
  },
  'PRODUCT.QR_EXPIRED': {
    en: 'This QR code has expired',
    ar: 'انتهت صلاحية رمز الاستجابة السريعة',
  },
  'PRODUCT.QR_ALREADY_EXISTS': {
    en: 'A QR code already exists for this booking',
    ar: 'يوجد رمز استجابة سريعة لهذا الحجز بالفعل',
  },
  'PRODUCT.QR_GENERATE_FAILED': {
    en: 'Failed to generate QR code. Please try again.',
    ar: 'فشل إنشاء رمز الاستجابة السريعة. يرجى المحاولة مرة أخرى.',
  },
  'PRODUCT.QR_VERIFY_FAILED': {
    en: 'Failed to verify QR code. Please try again.',
    ar: 'فشل التحقق من رمز الاستجابة السريعة. يرجى المحاولة مرة أخرى.',
  },
  'PRODUCT.QR_FETCH_FAILED': {
    en: 'Failed to retrieve QR codes. Please try again.',
    ar: 'فشل استرداد رموز الاستجابة السريعة. يرجى المحاولة مرة أخرى.',
  },
  'PRODUCT.QR_NOT_FOR_CONFIRMED': {
    en: 'QR codes can only be generated for confirmed bookings',
    ar: 'يمكن إنشاء رموز الاستجابة السريعة للحجوزات المؤكدة فقط',
  },

  // Validation
  'PRODUCT.VALIDATION_FAILED': {
    en: 'Invalid product data',
    ar: 'بيانات المنتج غير صالحة',
  },
  'PRODUCT.FIELD_REQUIRED': {
    en: 'This field is required',
    ar: 'هذا الحقل مطلوب',
  },
  'PRODUCT.INVALID_DATE': {
    en: 'Invalid date format',
    ar: 'تنسيق التاريخ غير صالح',
  },

  // Validation extras
  'PRODUCT.INVALID_COORDINATES': {
    en: 'Invalid coordinates. Please enter a valid number.',
    ar: 'إحداثيات غير صالحة. يرجى إدخال رقم صالح.',
  },
  'PRODUCT.INVALID_CAPACITY': {
    en: 'Invalid capacity value.',
    ar: 'قيمة السعة غير صالحة.',
  },
  'PRODUCT.INVALID_EMAIL': {
    en: 'Please enter a valid email address.',
    ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
  },
  'PRODUCT.INVALID_PHONE': {
    en: 'Phone must be in E.164 format starting with +',
    ar: 'يجب أن يكون الهاتف بتنسيق E.164 ويبدأ بعلامة +',
  },

  // ─── Success / info messages ─────────────────────────────────────────────────
  'PRODUCT.QR_NO_BOOKINGS_FOUND': {
    en: 'No bookings found for this partner.',
    ar: 'لم يتم العثور على حجوزات لهذا الشريك.',
  },
  'PRODUCT.QR_MARKED_EXPIRED': {
    en: '{count} QR code(s) marked as expired.',
    ar: 'تم تحديد {count} رمز (رموز) استجابة سريعة كمنتهية الصلاحية.',
  },
  'PRODUCT.QR_CLEANUP_DONE': {
    en: '{count} expired QR code(s) removed.',
    ar: 'تم حذف {count} رمز (رموز) استجابة سريعة منتهية الصلاحية.',
  },
  'PRODUCT.NOTIFICATION_MARKED_READ': {
    en: 'Notification marked as read.',
    ar: 'تم تعيين الإشعار كمقروء.',
  },
  'PRODUCT.NOTIFICATIONS_MARKED_READ': {
    en: '{count} notification(s) marked as read.',
    ar: 'تم تعيين {count} إشعار (إشعارات) كمقروء.',
  },
};
