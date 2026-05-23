import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType, NotificationAction, RecipientType } from './enums/notification.enum';

@Injectable()
export class NotificationsFacadeService {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ---------------------------------------------------------
  // Partner Onboarding
  // ---------------------------------------------------------
  async notifyPartnerApplicationSubmitted(userId: string, name: string) {
    return this.notificationsService.create({
      recipientType: RecipientType.ADMIN,
      type: NotificationType.APPROVAL,
      action: NotificationAction.PARTNER_SUBMITTED,
      titleEn: 'New Partner Application',
      titleAr: 'طلب شراكة جديد',
      bodyEn: `User ${name} has applied to become a partner.`,
      bodyAr: `لقد تقدم المستخدم ${name} بطلب ليصبح شريكًا.`,
      actorId: userId,
      entityId: userId,
      entityModel: 'User',
    });
  }

  async notifyPartnerApplicationApproved(userId: string) {
    return this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.APPROVAL,
      action: NotificationAction.PARTNER_APPROVED,
      titleEn: 'Application Approved',
      titleAr: 'تمت الموافقة على الطلب',
      bodyEn: 'Congratulations! Your partner application has been approved.',
      bodyAr: 'تهانينا! تمت الموافقة على طلب الشراكة الخاص بك.',
      entityId: userId,
      entityModel: 'User',
    });
  }

  async notifyPartnerApplicationRejected(userId: string, reason?: string) {
    return this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.APPROVAL,
      action: NotificationAction.PARTNER_REJECTED,
      titleEn: 'Application Rejected',
      titleAr: 'تم رفض الطلب',
      bodyEn: `Your partner application has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
      bodyAr: `تم رفض طلب الشراكة الخاص بك.${reason ? ` السبب: ${reason}` : ''}`,
      entityId: userId,
      entityModel: 'User',
    });
  }

  // ---------------------------------------------------------
  // Asset (Venues & Products) Approvals
  // ---------------------------------------------------------
  async notifyAssetSubmitted(
    entityId: string,
    entityModel: string, // e.g., 'EventVenue', 'Yacht'
    titleEn: string,
    actorId: string,
  ) {
    return this.notificationsService.create({
      recipientType: RecipientType.ADMIN,
      type: NotificationType.APPROVAL,
      action: entityModel === 'EventVenue' ? NotificationAction.VENUE_SUBMITTED : NotificationAction.PRODUCT_SUBMITTED,
      titleEn: `New ${entityModel} Submitted`,
      titleAr: `تم تقديم ${entityModel} جديد`,
      bodyEn: `A new listing "${titleEn}" has been submitted for review.`,
      bodyAr: `تم تقديم قائمة جديدة "${titleEn}" للمراجعة.`,
      actorId,
      entityId,
      entityModel,
    });
  }

  async notifyAssetApproved(
    entityId: string,
    entityModel: string,
    titleEn: string,
    ownerId: string,
  ) {
    return this.notificationsService.create({
      recipientType: RecipientType.PARTNER,
      recipientId: ownerId,
      type: NotificationType.APPROVAL,
      action: entityModel === 'EventVenue' ? NotificationAction.VENUE_APPROVED : NotificationAction.PRODUCT_APPROVED,
      titleEn: 'Listing Approved',
      titleAr: 'تمت الموافقة على القائمة',
      bodyEn: `Your listing "${titleEn}" has been approved and is now live.`,
      bodyAr: `تمت الموافقة على قائمتك "${titleEn}" وهي الآن حية.`,
      entityId,
      entityModel,
    });
  }

  async notifyAssetRejected(
    entityId: string,
    entityModel: string,
    titleEn: string,
    ownerId: string,
    reason?: string,
  ) {
    return this.notificationsService.create({
      recipientType: RecipientType.PARTNER,
      recipientId: ownerId,
      type: NotificationType.APPROVAL,
      action: entityModel === 'EventVenue' ? NotificationAction.VENUE_REJECTED : NotificationAction.PRODUCT_REJECTED,
      titleEn: 'Listing Rejected',
      titleAr: 'تم رفض القائمة',
      bodyEn: `Your listing "${titleEn}" has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
      bodyAr: `تم رفض قائمتك "${titleEn}".${reason ? ` السبب: ${reason}` : ''}`,
      entityId,
      entityModel,
    });
  }

  async notifyAssetRevisionRequested(
    entityId: string,
    entityModel: string,
    titleEn: string,
    ownerId: string,
    reason?: string,
  ) {
    return this.notificationsService.create({
      recipientType: RecipientType.PARTNER,
      recipientId: ownerId,
      type: NotificationType.APPROVAL,
      action: NotificationAction.VENUE_REVISION_REQUESTED,
      titleEn: 'Revision Requested',
      titleAr: 'مطلوب مراجعة',
      bodyEn: `A revision is requested for "${titleEn}".${reason ? ` Reason: ${reason}` : ''}`,
      bodyAr: `مطلوب مراجعة لـ "${titleEn}".${reason ? ` السبب: ${reason}` : ''}`,
      entityId,
      entityModel,
    });
  }

  // ---------------------------------------------------------
  // Bookings
  // ---------------------------------------------------------
  async notifyBookingCreated(
    bookingId: string,
    partnerId: string,
    userId: string,
    productTitleEn: string,
  ) {
    // Notify Partner
    await this.notificationsService.create({
      recipientType: RecipientType.PARTNER,
      recipientId: partnerId,
      type: NotificationType.BOOKING,
      action: NotificationAction.BOOKING_CREATED,
      titleEn: 'New Booking Received',
      titleAr: 'تم استلام حجز جديد',
      bodyEn: `You have a new booking request for "${productTitleEn}".`,
      bodyAr: `لديك طلب حجز جديد لـ "${productTitleEn}".`,
      actorId: userId,
      entityId: bookingId,
      entityModel: 'Booking',
    });

    // Notify User
    await this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.BOOKING,
      action: NotificationAction.BOOKING_CREATED,
      titleEn: 'Booking Requested',
      titleAr: 'تم طلب الحجز',
      bodyEn: `Your booking for "${productTitleEn}" has been successfully placed.`,
      bodyAr: `تم تقديم طلب الحجز الخاص بك لـ "${productTitleEn}" بنجاح.`,
      entityId: bookingId,
      entityModel: 'Booking',
    });
  }

  async notifyBookingConfirmed(bookingId: string, userId: string, productTitleEn: string) {
    return this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.BOOKING,
      action: NotificationAction.BOOKING_CONFIRMED,
      titleEn: 'Booking Confirmed',
      titleAr: 'تم تأكيد الحجز',
      bodyEn: `Your booking for "${productTitleEn}" has been confirmed!`,
      bodyAr: `تم تأكيد حجزك لـ "${productTitleEn}"!`,
      entityId: bookingId,
      entityModel: 'Booking',
    });
  }

  async notifyBookingRejected(bookingId: string, userId: string, productTitleEn: string) {
    return this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.BOOKING,
      action: NotificationAction.BOOKING_REJECTED,
      titleEn: 'Booking Rejected',
      titleAr: 'تم رفض الحجز',
      bodyEn: `Unfortunately, your booking for "${productTitleEn}" was rejected.`,
      bodyAr: `للأسف، تم رفض حجزك لـ "${productTitleEn}".`,
      entityId: bookingId,
      entityModel: 'Booking',
    });
  }

  async notifyBookingCancelled(bookingId: string, partnerId: string, userId: string, productTitleEn: string, actorRole: string) {
    // If user cancelled, notify partner
    if (actorRole === 'user') {
      await this.notificationsService.create({
        recipientType: RecipientType.PARTNER,
        recipientId: partnerId,
        type: NotificationType.BOOKING,
        action: NotificationAction.BOOKING_CANCELLED,
        titleEn: 'Booking Cancelled',
        titleAr: 'تم إلغاء الحجز',
        bodyEn: `A user has cancelled their booking for "${productTitleEn}".`,
        bodyAr: `قام المستخدم بإلغاء حجزه لـ "${productTitleEn}".`,
        actorId: userId,
        entityId: bookingId,
        entityModel: 'Booking',
      });
    } else {
      // If partner/admin cancelled, notify user
      await this.notificationsService.create({
        recipientType: RecipientType.USER,
        recipientId: userId,
        type: NotificationType.BOOKING,
        action: NotificationAction.BOOKING_CANCELLED,
        titleEn: 'Booking Cancelled',
        titleAr: 'تم إلغاء الحجز',
        bodyEn: `Your booking for "${productTitleEn}" has been cancelled.`,
        bodyAr: `تم إلغاء حجزك لـ "${productTitleEn}".`,
        entityId: bookingId,
        entityModel: 'Booking',
      });
    }
  }

  async notifyBookingCompleted(bookingId: string, userId: string, productTitleEn: string) {
    return this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.BOOKING,
      action: NotificationAction.BOOKING_COMPLETED,
      titleEn: 'Booking Completed',
      titleAr: 'اكتمل الحجز',
      bodyEn: `Hope you enjoyed your experience with "${productTitleEn}"!`,
      bodyAr: `نأمل أن تكون قد استمتعت بتجربتك مع "${productTitleEn}"!`,
      entityId: bookingId,
      entityModel: 'Booking',
    });
  }

  async notifyPaymentUpdated(bookingId: string, partnerId: string, userId: string, status: string) {
    // Notify Partner
    await this.notificationsService.create({
      recipientType: RecipientType.PARTNER,
      recipientId: partnerId,
      type: NotificationType.BOOKING,
      action: NotificationAction.PAYMENT_UPDATED,
      titleEn: 'Payment Status Updated',
      titleAr: 'تحديث حالة الدفع',
      bodyEn: `Payment status for a booking is now ${status}.`,
      bodyAr: `حالة الدفع للحجز الآن هي ${status}.`,
      entityId: bookingId,
      entityModel: 'Booking',
    });

    // Notify User
    await this.notificationsService.create({
      recipientType: RecipientType.USER,
      recipientId: userId,
      type: NotificationType.BOOKING,
      action: NotificationAction.PAYMENT_UPDATED,
      titleEn: 'Payment Status Updated',
      titleAr: 'تحديث حالة الدفع',
      bodyEn: `Your booking payment status is now ${status}.`,
      bodyAr: `حالة الدفع لحجزك الآن هي ${status}.`,
      entityId: bookingId,
      entityModel: 'Booking',
    });
  }

  async notifyQRVerified(bookingId: string, partnerId: string, userId: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours

    // We use Promise.allSettled to ensure both notifications attempt to send,
    // and one failing doesn't stop the other.
    await Promise.allSettled([
      // Notify User
      this.notificationsService.create({
        recipientType: RecipientType.USER,
        recipientId: userId,
        type: NotificationType.BOOKING,
        action: NotificationAction.QR_VERIFIED,
        titleEn: 'Check-in verified',
        titleAr: 'تم التحقق من تسجيل الدخول',
        bodyEn: `Your QR code was successfully verified. Enjoy!`,
        bodyAr: `تم التحقق من رمز QR الخاص بك بنجاح. استمتع!`,
        entityId: bookingId,
        entityModel: 'Booking',
        expiresAt,
      }),
      
      // Notify Partner
      this.notificationsService.create({
        recipientType: RecipientType.PARTNER,
        recipientId: partnerId,
        type: NotificationType.BOOKING,
        action: NotificationAction.QR_VERIFIED,
        titleEn: 'Guest checked in',
        titleAr: 'تم تسجيل دخول الضيف',
        bodyEn: `A guest has successfully checked in for their booking.`,
        bodyAr: `لقد سجل ضيف الدخول بنجاح لحجزه.`,
        entityId: bookingId,
        entityModel: 'Booking',
        expiresAt,
      })
    ]);
  }
}
