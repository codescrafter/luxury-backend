import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, ESignInMethods } from '../types';
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

  @Prop({ isRequired: false })
  password: string;

  @Prop()
  signInMethod: ESignInMethods;

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
