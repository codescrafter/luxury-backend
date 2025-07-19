import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ResortDocument = Resort & Document;

@Schema({ timestamps: true })
export class Resort {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: "resort" })
  type: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: false })
  isAnnualResort: boolean;

  @Prop({ default: false })
  isDailyResort: boolean;

  @Prop({ default: false })
  canHostEvent: boolean;

  @Prop({ type: [String], default: [] })
  amenities?: string[];

  @Prop()
  numberOfRooms?: number;

  @Prop()
  numberOfBathrooms?: number;

  @Prop()
  totalAreaInSqFt?: number;

  @Prop()
  starRating?: number;

  @Prop()
  dailyPrice?: number;

  @Prop()
  yearlyPrice?: number;

  @Prop()
  checkInTime?: string;

  @Prop()
  checkOutTime?: string;

  @Prop({ default: false })
  petFriendly?: boolean;

  @Prop({ default: false })
  smokingAllowed?: boolean;

  @Prop({ default: false })
  parkingAvailable?: boolean;

  @Prop({ default: false })
  wifiAvailable?: boolean;

  @Prop({ type: [String], default: [] })
  cancellationPolicy?: string[];

  @Prop({ type: [String], default: [] })
  termsAndConditions?: string[];

  @Prop({ type: [String], default: [] })
  safetyFeatures?: string[];

  @Prop({ default: false })
  insuranceProvided?: boolean;

  @Prop({ required: true })
  lat: number;
  @Prop({ required: true })
  lng: number;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  region: string;
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ type: [String], default: [] })
  videos?: string[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product', default: [] })
  availableProducts?: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({ type: Number, default: 0 })
  averageRating?: number;

  @Prop({ type: Number, default: 0 })
  reviewCount?: number;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'revision', 'rejected'] })
  status: 'pending' | 'approved' | 'revision' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;
}

export const ResortSchema = SchemaFactory.createForClass(Resort);
