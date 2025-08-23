import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

export type SpeedboatDocument = Speedboat & Document;

@Schema({ timestamps: true })
export class Speedboat {
  @Prop({ required: true })
  titleEn: string;

  @Prop({ required: true })
  titleAr: string;

  @Prop({ required: true })
  descriptionEn: string;

  @Prop({ required: true })
  descriptionAr: string;

  @Prop({ required: false, default: 'speedboat' })
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

  @Prop({ required: true, type: [String] })
  cancellationPolicyEn: string[];

  @Prop({ required: true, type: [String] })
  cancellationPolicyAr: string[];

  @Prop({ required: true, type: [String] })
  termsAndConditionsEn: string[];

  @Prop({ required: true, type: [String] })
  termsAndConditionsAr: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos?: string[];

  @Prop({ type: [String], default: [] })
  tagsEn?: string[];

  @Prop({ type: [String], default: [] })
  tagsAr?: string[];

  @Prop({ required: true })
  engineType: string;

  @Prop({ required: true })
  enginePower: string;

  @Prop({ required: true })
  maxSpeed: number;

  @Prop({ required: true })
  capacity: number;

  @Prop()
  modelYear?: number;

  @Prop()
  brand?: string;

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
  cityEn: string;
  @Prop({ required: true })
  cityAr: string;
  @Prop({ required: true })
  regionEn: string;
  @Prop({ required: true })
  regionAr: string;
  @Prop({ required: true })
  countryEn: string;
  @Prop({ required: true })
  countryAr: string;
  @Prop({ required: true })
  addressEn: string;
  @Prop({ required: true })
  addressAr: string;

  @Prop({ type: Number, default: 0 })
  averageRating?: number;

  @Prop({ type: Number, default: 0 })
  reviewCount?: number;

  @Prop({ type: Number, default: 0 })
  totalBookings?: number;

  @Prop({ default: false })
  isFeatured?: boolean;

  @Prop({
    default: 'pending',
    enum: ['pending', 'approved', 'revision', 'rejected'],
  })
  status: 'pending' | 'approved' | 'revision' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;
}

export const SpeedboatSchema = SchemaFactory.createForClass(Speedboat);

// Add performance indexes
SpeedboatSchema.index({ status: 1, ownerId: 1 }); // For filtering by status and owner
SpeedboatSchema.index({ status: 1, createdAt: -1 }); // For sorting by creation date
SpeedboatSchema.index({ ownerId: 1, status: 1, type: 1 }); // For owner's products by type
SpeedboatSchema.index({ cityEn: 1, status: 1 }); // For location-based queries
SpeedboatSchema.index({ cityAr: 1, status: 1 }); // For Arabic location queries
SpeedboatSchema.index({ pricePerHour: 1, status: 1 }); // For price-based filtering
SpeedboatSchema.index({ pricePerDay: 1, status: 1 }); // For daily price filtering
SpeedboatSchema.index({ capacity: 1, status: 1 }); // For capacity-based filtering
SpeedboatSchema.index({ isFeatured: 1, status: 1 }); // For featured products
