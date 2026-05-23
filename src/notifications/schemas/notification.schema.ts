import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { NotificationType, NotificationAction, RecipientType } from '../enums/notification.enum';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: String, enum: Object.values(RecipientType) })
  recipientType: RecipientType;

  // Optional because recipientType could be 'ALL' for broadcasts
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  recipientId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: String, enum: Object.values(NotificationType) })
  type: NotificationType;

  @Prop({ required: true, type: String, enum: Object.values(NotificationAction) })
  action: NotificationAction;

  @Prop({ required: true })
  titleEn: string;

  @Prop({ required: true })
  titleAr: string;

  @Prop({ required: true })
  bodyEn: string;

  @Prop({ required: true })
  bodyAr: string;

  // Flexible payload for additional context (e.g., booking ID, total amount, venue title)
  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: Record<string, any>;

  // User who triggered this action
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  actorId?: MongooseSchema.Types.ObjectId;

  // Reference to the main entity involved (e.g., Booking, EventVenue, Product)
  @Prop({ type: MongooseSchema.Types.ObjectId })
  entityId?: MongooseSchema.Types.ObjectId;

  // Model name of the entity for dynamic population
  @Prop({ type: String })
  entityModel?: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Date })
  readAt?: Date;

  @Prop({ type: Date })
  seenAt?: Date; // Differentiates between notification panel opened vs specific notification clicked

  // Optional expiration time. Expired notifications are excluded from standard queries.
  @Prop({ type: Date })
  expiresAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Optimize queries commonly used for fetching notifications
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipientType: 1, createdAt: -1 });
NotificationSchema.index({ entityId: 1, entityModel: 1 });
NotificationSchema.index({ expiresAt: 1 }); // Used to filter out expired notifications
