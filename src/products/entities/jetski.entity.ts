// File: src/products/entities/jetski.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from './product.entity';

export type JetskiDocument = Jetski & Document;

@Schema({ timestamps: true })
export class Jetski extends Product {
  @Prop({ required: true })
  engineType: string; // e.g. '4-stroke'

  @Prop({ required: true })
  enginePower: string; // e.g. '1800cc'

  @Prop({ required: true })
  maxSpeed: number; // in km/h

  @Prop({ required: true })
  seatingCapacity: number;

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
}

export const JetskiSchema = SchemaFactory.createForClass(Jetski);
