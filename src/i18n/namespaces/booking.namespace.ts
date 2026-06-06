/**
 * BOOKING namespace — error codes and translations for the Bookings module.
 *
 * To add a new error:
 *   1. Add a key to BOOKING_CODES
 *   2. Add the bilingual translation to BOOKING_TRANSLATIONS
 *   3. Use in service: throw new NotFoundException(BOOKING_CODES.NOT_FOUND)
 */

import { TranslationMap } from '../types';

export const BOOKING_CODES = {
  NOT_FOUND: 'BOOKING.NOT_FOUND',
  ALREADY_EXISTS: 'BOOKING.ALREADY_EXISTS',
  UNAUTHORIZED: 'BOOKING.UNAUTHORIZED',
  UNAVAILABLE_DATE: 'BOOKING.UNAVAILABLE_DATE',
  CANCELLATION_NOT_ALLOWED: 'BOOKING.CANCELLATION_NOT_ALLOWED',
  PAYMENT_REQUIRED: 'BOOKING.PAYMENT_REQUIRED',
  QR_INVALID: 'BOOKING.QR_INVALID',
  QR_ALREADY_USED: 'BOOKING.QR_ALREADY_USED',
  QR_EXPIRED: 'BOOKING.QR_EXPIRED',
} as const;

export type BookingCode = (typeof BOOKING_CODES)[keyof typeof BOOKING_CODES];

export const BOOKING_TRANSLATIONS: TranslationMap = {
  'BOOKING.NOT_FOUND': {
    en: 'Booking not found',
    ar: 'الحجز غير موجود',
  },
  'BOOKING.ALREADY_EXISTS': {
    en: 'A booking already exists for this date and time',
    ar: 'يوجد حجز بالفعل لهذا التاريخ والوقت',
  },
  'BOOKING.UNAUTHORIZED': {
    en: 'You are not authorized to manage this booking',
    ar: 'غير مصرح لك بإدارة هذا الحجز',
  },
  'BOOKING.UNAVAILABLE_DATE': {
    en: 'The selected date is not available for booking',
    ar: 'التاريخ المحدد غير متاح للحجز',
  },
  'BOOKING.CANCELLATION_NOT_ALLOWED': {
    en: 'This booking cannot be cancelled',
    ar: 'لا يمكن إلغاء هذا الحجز',
  },
  'BOOKING.PAYMENT_REQUIRED': {
    en: 'Payment is required to confirm this booking',
    ar: 'الدفع مطلوب لتأكيد هذا الحجز',
  },
  'BOOKING.QR_INVALID': {
    en: 'Invalid QR code',
    ar: 'رمز الاستجابة السريعة غير صالح',
  },
  'BOOKING.QR_ALREADY_USED': {
    en: 'This QR code has already been used',
    ar: 'تم استخدام رمز الاستجابة السريعة هذا بالفعل',
  },
  'BOOKING.QR_EXPIRED': {
    en: 'This QR code has expired',
    ar: 'انتهت صلاحية رمز الاستجابة السريعة',
  },
};
