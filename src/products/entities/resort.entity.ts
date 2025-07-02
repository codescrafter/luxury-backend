// File: src/products/entities/resort.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

export type ResortDocument = Resort & Document;

@Schema({ timestamps: true })
export class Resort {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['daily', 'annual'] })
  type: 'daily' | 'annual';

  @Prop({ type: [String], default: [] })
  facilities: string[]; // e.g., ['Pool', 'WiFi']

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  locationId: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ default: 0 })
  resubmissionCount: number;
}

export const ResortSchema = SchemaFactory.createForClass(Resort);
