import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventVenueRequestDocument = EventVenueRequest & Document;

export enum EventVenueRequestStatus {
  PENDING = 'pending',
  CONTACTED = 'contacted',
  DISMISSED = 'dismissed',
}

@Schema({ timestamps: true })
export class EventVenueRequest {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'EventVenue',
    required: true,
  })
  venueId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  partnerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  preferredEventDate?: string;

  @Prop()
  preferredGuestCount?: string;

  @Prop()
  budgetNotes?: string;

  @Prop({
    default: EventVenueRequestStatus.PENDING,
    enum: Object.values(EventVenueRequestStatus),
  })
  status: EventVenueRequestStatus;

  @Prop()
  respondedAt?: Date;

  @Prop()
  partnerNotes?: string;
}

export const EventVenueRequestSchema =
  SchemaFactory.createForClass(EventVenueRequest);

EventVenueRequestSchema.index({ partnerId: 1, status: 1 });
EventVenueRequestSchema.index({ venueId: 1, status: 1 });
