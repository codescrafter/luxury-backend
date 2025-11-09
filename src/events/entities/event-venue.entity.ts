import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventVenueDocument = EventVenue & Document;

@Schema({ timestamps: true })
export class EventVenue {
  @Prop({ required: true })
  titleEn: string;

  @Prop({ required: true })
  titleAr: string;

  @Prop({ required: true })
  descriptionEn: string;

  @Prop({ required: true })
  descriptionAr: string;

  @Prop({ default: 'event-venue' })
  type: string;

  @Prop({ type: Number })
  guestCapacity?: number;

  @Prop({ type: Number })
  minimumGuests?: number;

  @Prop({ type: Number })
  maximumGuests?: number;

  @Prop({ type: Number })
  areaInSqM?: number;

  @Prop({ default: false })
  isIndoor?: boolean;

  @Prop({ default: false })
  isOutdoor?: boolean;

  @Prop({ type: [String], default: [] })
  tagsEn?: string[];

  @Prop({ type: [String], default: [] })
  tagsAr?: string[];

  @Prop({ required: true })
  cityEn: string;

  @Prop({ required: true })
  cityAr: string;

  @Prop({ required: true })
  countryEn: string;

  @Prop({ required: true })
  countryAr: string;

  @Prop({ required: true })
  addressEn: string;

  @Prop({ required: true })
  addressAr: string;

  @Prop({ required: true, type: Number })
  lat: number;

  @Prop({ required: true, type: Number })
  lng: number;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ type: [String], default: [] })
  videos?: string[];

  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({ type: Number, default: 0 })
  averageRating?: number;

  @Prop({ type: Number, default: 0 })
  reviewCount?: number;

  @Prop({
    default: 'pending',
    enum: ['pending', 'approved', 'revision', 'rejected'],
  })
  status: 'pending' | 'approved' | 'revision' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;
}

export const EventVenueSchema = SchemaFactory.createForClass(EventVenue);

EventVenueSchema.index({ status: 1, ownerId: 1 });
EventVenueSchema.index({ status: 1, createdAt: -1 });
EventVenueSchema.index({ ownerId: 1, status: 1 });
EventVenueSchema.index({ cityEn: 1, status: 1 });
EventVenueSchema.index({ cityAr: 1, status: 1 });
EventVenueSchema.index({ isFeatured: 1, status: 1 });
EventVenueSchema.index({ tagsEn: 1, status: 1 });
EventVenueSchema.index({ tagsAr: 1, status: 1 });
