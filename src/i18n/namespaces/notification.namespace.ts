/**
 * NOTIFICATION namespace — error codes and translations for the Notifications module.
 */

import { TranslationMap } from '../types';

export const NOTIFICATION_CODES = {
  NOT_FOUND: 'NOTIFICATION.NOT_FOUND',
  UNAUTHORIZED: 'NOTIFICATION.UNAUTHORIZED',
  SEND_FAILED: 'NOTIFICATION.SEND_FAILED',
} as const;

export type NotificationCode = (typeof NOTIFICATION_CODES)[keyof typeof NOTIFICATION_CODES];

export const NOTIFICATION_TRANSLATIONS: TranslationMap = {
  'NOTIFICATION.NOT_FOUND': {
    en: 'Notification not found',
    ar: 'الإشعار غير موجود',
  },
  'NOTIFICATION.UNAUTHORIZED': {
    en: 'You are not authorized to access this notification',
    ar: 'غير مصرح لك بالوصول إلى هذا الإشعار',
  },
  'NOTIFICATION.SEND_FAILED': {
    en: 'Failed to send notification. Please try again.',
    ar: 'فشل إرسال الإشعار. يرجى المحاولة مرة أخرى.',
  },
};
