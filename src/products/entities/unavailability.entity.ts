import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Unavailability extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false })
  consumerId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  productType: string;

  @Prop({ type: String, required: true, enum: ['partner_blocked', 'booked'] })
  unavailabilityType: string;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;
}

const UnavailabilitySchema = SchemaFactory.createForClass(Unavailability);

export { UnavailabilitySchema }; 