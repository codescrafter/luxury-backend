// File: src/products/entities/speedboat.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from './product.entity';

export type SpeedboatDocument = Speedboat & Document;

@Schema({ timestamps: true })
export class Speedboat extends Product {
  @Prop({ required: true })
  engineType: string; // e.g., 'inboard', 'outboard'

  @Prop({ required: true })
  enginePower: string; // e.g., '250 HP'

  @Prop({ required: true })
  seatingCapacity: number;

  @Prop({ required: true })
  length: number; // in feet

  @Prop({ required: true })
  brand: string;
}

export const SpeedboatSchema = SchemaFactory.createForClass(Speedboat);
