/**
 * EVENT namespace — stable error codes and translations for the Events module.
 *
 * Covers: Event venue lifecycle, venue request flow, access control,
 * media uploads, and edge-case state conflicts.
 *
 * Usage in services:
 *   throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
 *   throw new ConflictException(EVENT_CODES.VENUE_NOT_AVAILABLE);
 */

import { TranslationMap } from '../types';

export const EVENT_CODES = {
  // ─── Venue lifecycle ────────────────────────────────────────────────────
  VENUE_NOT_FOUND: 'EVENT.VENUE_NOT_FOUND',
  VENUE_ALREADY_APPROVED: 'EVENT.VENUE_ALREADY_APPROVED',
  VENUE_NOT_APPROVED: 'EVENT.VENUE_NOT_APPROVED',
  VENUE_ALREADY_REJECTED: 'EVENT.VENUE_ALREADY_REJECTED',
  VENUE_NOT_AVAILABLE: 'EVENT.VENUE_NOT_AVAILABLE',
  VENUE_CANNOT_RESUBMIT: 'EVENT.VENUE_CANNOT_RESUBMIT',

  // ─── Venue request (booking) flow ───────────────────────────────────────
  REQUEST_NOT_FOUND: 'EVENT.REQUEST_NOT_FOUND',
  REQUEST_ALREADY_RESPONDED: 'EVENT.REQUEST_ALREADY_RESPONDED',
  REQUEST_ALREADY_EXISTS: 'EVENT.REQUEST_ALREADY_EXISTS',
  REQUEST_DISMISSED: 'EVENT.REQUEST_DISMISSED',
  REQUEST_CANNOT_UPDATE: 'EVENT.REQUEST_CANNOT_UPDATE',

  // ─── Access / permissions ────────────────────────────────────────────────
  UNAUTHORIZED: 'EVENT.UNAUTHORIZED',
  FORBIDDEN: 'EVENT.FORBIDDEN',
  ADMIN_ONLY: 'EVENT.ADMIN_ONLY',
  PARTNER_ONLY: 'EVENT.PARTNER_ONLY',
  NOT_VENUE_OWNER: 'EVENT.NOT_VENUE_OWNER',
  NOT_REQUEST_OWNER: 'EVENT.NOT_REQUEST_OWNER',

  // ─── Media upload failures ───────────────────────────────────────────────
  IMAGE_UPLOAD_FAILED: 'EVENT.IMAGE_UPLOAD_FAILED',
  VIDEO_UPLOAD_FAILED: 'EVENT.VIDEO_UPLOAD_FAILED',

  // ─── Edge-case: state conflicts ─────────────────────────────────────────
  // Venue approved while already in approved state
  INVALID_STATUS_TRANSITION: 'EVENT.INVALID_STATUS_TRANSITION',
  // Venue has no valid owner (orphan venue)
  VENUE_OWNER_NOT_FOUND: 'EVENT.VENUE_OWNER_NOT_FOUND',

  // ─── Validation (used as DTO message options) ────────────────────────────
  VALIDATION_FAILED: 'EVENT.VALIDATION_FAILED',
  FIELD_REQUIRED: 'EVENT.FIELD_REQUIRED',
  INVALID_EMAIL: 'EVENT.INVALID_EMAIL',
  INVALID_PHONE: 'EVENT.INVALID_PHONE',
  INVALID_COORDINATES: 'EVENT.INVALID_COORDINATES',
  INVALID_CAPACITY: 'EVENT.INVALID_CAPACITY',
} as const;

export type EventCode = (typeof EVENT_CODES)[keyof typeof EVENT_CODES];

// ─── Translations ─────────────────────────────────────────────────────────────

export const EVENT_TRANSLATIONS: TranslationMap = {
  // Venue lifecycle
  'EVENT.VENUE_NOT_FOUND': {
    en: 'Event venue not found',
    ar: 'قاعة الفعاليات غير موجودة',
  },
  'EVENT.VENUE_ALREADY_APPROVED': {
    en: 'This event venue is already approved',
    ar: 'تمت الموافقة على قاعة الفعاليات هذه بالفعل',
  },
  'EVENT.VENUE_NOT_APPROVED': {
    en: 'This event venue has not been approved yet',
    ar: 'لم تتم الموافقة على قاعة الفعاليات هذه بعد',
  },
  'EVENT.VENUE_ALREADY_REJECTED': {
    en: 'This event venue has already been rejected',
    ar: 'تم رفض قاعة الفعاليات هذه بالفعل',
  },
  'EVENT.VENUE_NOT_AVAILABLE': {
    en: 'This event venue is not available for requests',
    ar: 'قاعة الفعاليات هذه غير متاحة لاستقبال الطلبات',
  },
  'EVENT.VENUE_CANNOT_RESUBMIT': {
    en: 'This venue cannot be resubmitted in its current status',
    ar: 'لا يمكن إعادة تقديم هذه القاعة في حالتها الحالية',
  },

  // Venue requests
  'EVENT.REQUEST_NOT_FOUND': {
    en: 'Event venue request not found',
    ar: 'طلب قاعة الفعاليات غير موجود',
  },
  'EVENT.REQUEST_ALREADY_RESPONDED': {
    en: 'This request has already been responded to',
    ar: 'تم الرد على هذا الطلب بالفعل',
  },
  'EVENT.REQUEST_ALREADY_EXISTS': {
    en: 'A request for this venue already exists',
    ar: 'يوجد طلب لهذه القاعة بالفعل',
  },
  'EVENT.REQUEST_DISMISSED': {
    en: 'This request has been dismissed',
    ar: 'تم رفض هذا الطلب',
  },
  'EVENT.REQUEST_CANNOT_UPDATE': {
    en: 'This request cannot be updated in its current status',
    ar: 'لا يمكن تحديث هذا الطلب في حالته الحالية',
  },

  // Access / permissions
  'EVENT.UNAUTHORIZED': {
    en: 'You are not authorized to access this event resource',
    ar: 'غير مصرح لك بالوصول إلى هذا المورد في الفعاليات',
  },
  'EVENT.FORBIDDEN': {
    en: 'You do not have permission to perform this action',
    ar: 'ليس لديك إذن لتنفيذ هذا الإجراء',
  },
  'EVENT.ADMIN_ONLY': {
    en: 'This action is restricted to administrators only',
    ar: 'هذا الإجراء مقتصر على المسؤولين فقط',
  },
  'EVENT.PARTNER_ONLY': {
    en: 'This action is restricted to partners only',
    ar: 'هذا الإجراء مقتصر على الشركاء فقط',
  },
  'EVENT.NOT_VENUE_OWNER': {
    en: 'You are not the owner of this event venue',
    ar: 'أنت لست مالك قاعة الفعاليات هذه',
  },
  'EVENT.NOT_REQUEST_OWNER': {
    en: 'You are not the partner associated with this request',
    ar: 'أنت لست الشريك المرتبط بهذا الطلب',
  },

  // Media
  'EVENT.IMAGE_UPLOAD_FAILED': {
    en: 'Failed to upload event venue image. Please try again.',
    ar: 'فشل تحميل صورة قاعة الفعاليات. يرجى المحاولة مرة أخرى.',
  },
  'EVENT.VIDEO_UPLOAD_FAILED': {
    en: 'Failed to upload event venue video. Please try again.',
    ar: 'فشل تحميل فيديو قاعة الفعاليات. يرجى المحاولة مرة أخرى.',
  },

  // State conflicts (edge cases)
  'EVENT.INVALID_STATUS_TRANSITION': {
    en: 'This status transition is not allowed',
    ar: 'تغيير الحالة هذا غير مسموح به',
  },
  'EVENT.VENUE_OWNER_NOT_FOUND': {
    en: 'The owner of this event venue could not be found',
    ar: 'تعذر العثور على مالك قاعة الفعاليات هذه',
  },

  // Validation
  'EVENT.VALIDATION_FAILED': {
    en: 'Invalid event venue data',
    ar: 'بيانات قاعة الفعاليات غير صالحة',
  },
  'EVENT.FIELD_REQUIRED': {
    en: 'This field is required',
    ar: 'هذا الحقل مطلوب',
  },
  'EVENT.INVALID_EMAIL': {
    en: 'Please enter a valid email address',
    ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
  },
  'EVENT.INVALID_PHONE': {
    en: 'Please enter a valid phone number in E.164 format (e.g. +971500000000)',
    ar: 'يرجى إدخال رقم هاتف صحيح بتنسيق E.164 (مثال: +971500000000)',
  },
  'EVENT.INVALID_COORDINATES': {
    en: 'Please enter valid GPS coordinates',
    ar: 'يرجى إدخال إحداثيات GPS صحيحة',
  },
  'EVENT.INVALID_CAPACITY': {
    en: 'Invalid guest capacity value',
    ar: 'قيمة سعة الضيوف غير صالحة',
  },
};
