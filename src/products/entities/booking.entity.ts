import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  consumerId: Types.ObjectId;

  // product id can be from yacht, jetski, kayak, resort, speedboat
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productType: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  partnerId:Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop()
  transactionId?: string;

  @Prop()
  specialRequests?: string;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  bookingStatus: BookingStatus;

  @Prop()
  cancellationReason?: string;

  @Prop()
  adultsCount?: number;

  @Prop()
  childrenCount?: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
