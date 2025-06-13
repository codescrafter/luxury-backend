import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  pricePerDay: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  amenities: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  includedServices: Record<string, any>;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product); 