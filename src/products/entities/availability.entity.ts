import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AvailabilityDocument = Availability & Document;

@Schema({ timestamps: true })
export class Availability {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  productId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: ['unavailable', 'booked'], required: true })
  status: 'unavailable' | 'booked';
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability); 