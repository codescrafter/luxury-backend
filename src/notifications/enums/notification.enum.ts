export enum NotificationType {
  SYSTEM = 'system',
  BOOKING = 'booking',
  APPROVAL = 'approval',
  PARTNER_ACTION = 'partner_action',
  ADMIN_ACTION = 'admin_action',
}

export enum NotificationAction {
  // Booking
  BOOKING_CREATED = 'booking_created',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_REJECTED = 'booking_rejected',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_COMPLETED = 'booking_completed',
  PAYMENT_UPDATED = 'payment_updated',
  QR_VERIFIED = 'qr_verified',

  // Approval
  VENUE_SUBMITTED = 'venue_submitted',
  VENUE_APPROVED = 'venue_approved',
  VENUE_REJECTED = 'venue_rejected',
  VENUE_REVISION_REQUESTED = 'venue_revision_requested',
  PRODUCT_SUBMITTED = 'product_submitted',
  PRODUCT_APPROVED = 'product_approved',
  PRODUCT_REJECTED = 'product_rejected',
  PARTNER_SUBMITTED = 'partner_submitted',
  PARTNER_APPROVED = 'partner_approved',
  PARTNER_REJECTED = 'partner_rejected',

  // Admin/System
  SYSTEM_ALERT = 'system_alert',
  ACCOUNT_UPDATE = 'account_update',
}

export enum RecipientType {
  USER = 'user',
  PARTNER = 'partner',
  ADMIN = 'admin',
  SECURITY = 'security',
  ALL = 'all', // For broadcast notifications
}
