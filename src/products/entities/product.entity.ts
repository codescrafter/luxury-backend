import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from './location.entity';
import { Amenity } from './amenity.entity';

export enum ProductType {
  RESORT = 'RESORT',
  YACHT = 'YACHT',
  JETSKI = 'JETSKI',
  KAYAK = 'KAYAK',
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true })
  location: Location;

  @Prop({ required: false })
  guestLimit: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Amenity' }], default: [] })
  amenities: Amenity[];

  @Prop()
  roomLimit?: number;

  @Prop({ required: true, enum: ProductType })
  type: ProductType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  linkedResort?: Product;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }], default: [] })
  linkedProducts?: Product[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add validation for roomLimit
ProductSchema.pre('save', function(next) {
  if (this.type === ProductType.RESORT && !this.roomLimit) {
    next(new Error('Room limit is required for Resort type products'));
  }
  if (this.type !== ProductType.RESORT && this.roomLimit) {
    next(new Error('Room limit is only applicable for Resort type products'));
  }
  next();
}); 