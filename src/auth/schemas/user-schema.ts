import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../types';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop({ isRequired: false })
  userHash: string;

  @Prop({
    type: [{ type: String, enum: Role }],
    default: [Role.USER],
  })
  role: Role[];

  @Prop({ isRequired: false })
  avatar: string;
}

export type UserDocument = User &
  Document & { createdAt: Date; updatedAt: Date };

export const UserSchema = SchemaFactory.createForClass(User);
