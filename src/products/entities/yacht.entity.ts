// File: src/products/entities/yacht.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from './product.entity';

export type YachtDocument = Yacht & Document;

@Schema({ timestamps: true })
export class Yacht extends Product {
  @Prop({ required: true })
  size: number; // in feet

  @Prop({ required: true })
  crewIncluded: boolean;

  @Prop({ required: true })
  cabins: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  guestCapacity: number;

  @Prop({ type: [String], default: [] })
  features: string[]; // e.g., ['Jacuzzi', 'WiFi']

  @Prop({ required: true })
  brand: string;
}

export const YachtSchema = SchemaFactory.createForClass(Yacht);
