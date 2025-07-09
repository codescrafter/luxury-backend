import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UnavailabilityDocument = Unavailability & Document;

@Schema({ timestamps: true })
export class Unavailability {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  startHour?: number; // 0-23, for hourly unavailability

  @Prop()
  endHour?: number; // 1-24, for hourly unavailability
}

export const UnavailabilitySchema = SchemaFactory.createForClass(Unavailability); 