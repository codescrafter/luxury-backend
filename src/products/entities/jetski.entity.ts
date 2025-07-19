import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type JetskiDocument = Jetski & Document;

@Schema({ timestamps: true })
export class Jetski {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: "jetski" })
  type: string;

  @Prop({ required: false, default: true })
  isRental: boolean;

  @Prop({ required: false, default: false })
  isEventProperty: boolean;

  @Prop({ required: true })
  pricePerHour: number;

  @Prop({ required: true })
  pricePerDay: number;

  @Prop({ required: true })
  securityDeposit: number;

  @Prop({ required: true })
  fuelIncluded: boolean;

  @Prop({ required: true })
  insuranceIncluded: boolean;

  @Prop({ required: true })
  licenseRequired: boolean;

  @Prop({ required: true })
  ageRequirement: number;

  @Prop({ required: true })
  cancellationPolicy: string[];

  @Prop({ required: true })
  termsAndConditions: string[];

  @Prop({ required: true })
  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos?: string[];

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ required: true })
  engineType: string; // e.g. '4-stroke'

  @Prop({ required: true })
  enginePower: string; // e.g. '1800cc'

  @Prop({ required: true })
  maxSpeed: number; // in km/h

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  brand: string;

  @Prop()
  modelYear?: number;

  @Prop()
  jetskiType?: string; // e.g. stand-up, sit-down

  @Prop()
  color?: string;

  @Prop({ default: false })
  lifeJacketsIncluded?: boolean;

  @Prop()
  minimumHours?: number;

  @Prop()
  maintenanceNotes?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

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

  @Prop({ type: Number, default: 0 })
  averageRating?: number;

  @Prop({ type: Number, default: 0 })
  reviewCount?: number;

  @Prop({ type: Number, default: 0 })
  totalBookings?: number;

  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'revision', 'rejected'] })
  status: 'pending' | 'approved' | 'revision' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;
}

export const JetskiSchema = SchemaFactory.createForClass(Jetski);
