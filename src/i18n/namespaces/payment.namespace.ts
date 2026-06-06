/**
 * PAYMENT namespace — error codes and translations for the Payments module.
 */

import { TranslationMap } from '../types';

export const PAYMENT_CODES = {
  NOT_FOUND: 'PAYMENT.NOT_FOUND',
  FAILED: 'PAYMENT.FAILED',
  ALREADY_PROCESSED: 'PAYMENT.ALREADY_PROCESSED',
  INVALID_AMOUNT: 'PAYMENT.INVALID_AMOUNT',
  REFUND_FAILED: 'PAYMENT.REFUND_FAILED',
  UNAUTHORIZED: 'PAYMENT.UNAUTHORIZED',
} as const;

export type PaymentCode = (typeof PAYMENT_CODES)[keyof typeof PAYMENT_CODES];

export const PAYMENT_TRANSLATIONS: TranslationMap = {
  'PAYMENT.NOT_FOUND': {
    en: 'Payment not found',
    ar: 'الدفعة غير موجودة',
  },
  'PAYMENT.FAILED': {
    en: 'Payment processing failed. Please try again.',
    ar: 'فشلت معالجة الدفع. يرجى المحاولة مرة أخرى.',
  },
  'PAYMENT.ALREADY_PROCESSED': {
    en: 'This payment has already been processed',
    ar: 'تمت معالجة هذه الدفعة بالفعل',
  },
  'PAYMENT.INVALID_AMOUNT': {
    en: 'Invalid payment amount',
    ar: 'مبلغ الدفع غير صالح',
  },
  'PAYMENT.REFUND_FAILED': {
    en: 'Refund processing failed. Please contact support.',
    ar: 'فشلت معالجة الاسترداد. يرجى الاتصال بالدعم.',
  },
  'PAYMENT.UNAUTHORIZED': {
    en: 'You are not authorized to manage this payment',
    ar: 'غير مصرح لك بإدارة هذه الدفعة',
  },
};
