// File: src/products/entities/product.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: 'jetski' | 'kayak' | 'yacht' | 'speedboat';

  @Prop({ required: true })
  isRental: boolean;

  @Prop({ required: true })
  isEventProperty: boolean;

  @Prop({
    type: new MongooseSchema(
      {
        pricePerHour: Number,
        pricePerDay: Number,
        securityDeposit: Number,
        fuelIncluded: Boolean,
        insuranceIncluded: Boolean,
        licenseRequired: Boolean,
        ageRequirement: Number,
        cancellationPolicy: [String],
        termsAndConditions: [String],
      },
      { _id: false },
    ),
  })
  rentalConditions: Record<string, any>;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos?: string[];

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true })
  locationId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Resort' })
  resortId?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
