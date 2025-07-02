// File: src/products/entities/kayak.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from './product.entity';

export type KayakDocument = Kayak & Document;

@Schema({ timestamps: true })
export class Kayak extends Product {
  @Prop({ required: true, enum: ['sit-on-top', 'sit-inside', 'tandem'] })
  kayakType: 'sit-on-top' | 'sit-inside' | 'tandem';

  @Prop({ required: true })
  material: string;

  @Prop({ required: true })
  length: number; // in feet or meters

  @Prop({ required: true })
  weightCapacity: number; // in kg

  @Prop({ default: true })
  paddlesIncluded: boolean;

  @Prop({ default: true })
  lifeJacketsIncluded: boolean;

  @Prop({ required: true })
  brand: string;
}

export const KayakSchema = SchemaFactory.createForClass(Kayak);
