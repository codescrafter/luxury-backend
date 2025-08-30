import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type BookingQrDocument = BookingQr & Document;

export enum QrStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class BookingQr {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  })
  bookingId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productType: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ enum: QrStatus, default: QrStatus.ACTIVE })
  status: QrStatus;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  qrImageUrl?: string;

  @Prop()
  redeemedAt?: Date;

  @Prop()
  redeemedBy?: Types.ObjectId;
}

export const BookingQrSchema = SchemaFactory.createForClass(BookingQr);

// Index for efficient token lookup
BookingQrSchema.index({ token: 1 });

// Index for booking lookup
BookingQrSchema.index({ bookingId: 1 });

// Index for expiration cleanup
BookingQrSchema.index({ expiresAt: 1, status: 1 });
