import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type YachtDocument = Yacht & Document;

@Schema({ timestamps: true })
export class Yacht {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: "yacht" })
  type: string;

  @Prop({ required: false, default: true })
  isRental: boolean;

  @Prop({ required: false, default: false })
  isEventProperty: boolean;

  @Prop({ required: true })
  capacity: number;

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
  cancellationPolicy: string[];

  @Prop({ required: true, type: [String] })
  termsAndConditions: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos?: string[];

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ required: true })
  yachtType: string; // e.g. sailing, motor, catamaran

  @Prop({ required: true })
  lengthInFeet: number;

  @Prop()
  crewIncluded?: boolean;

  @Prop()
  captainIncluded?: boolean;

  @Prop()
  numberOfCabins?: number;

  @Prop()
  numberOfBathrooms?: number;

  @Prop()
  modelYear?: number;

  @Prop()
  brand?: string;

  @Prop()
  color?: string;

  @Prop({ default: false })
  luxuryFeaturesIncluded?: boolean;

  @Prop()
  minimumHours?: number;

  @Prop()
  maintenanceNotes?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: mongoose.Schema.Types.ObjectId;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Resort' })
  resortId?: string;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;
}

export const YachtSchema = SchemaFactory.createForClass(Yacht);
