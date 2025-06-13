import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Location extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  })
  coordinates: {
    latitude: number;
    longitude: number;
  };

  @Prop()
  region?: string;

  @Prop()
  address?: string;

  @Prop()
  description?: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location); 