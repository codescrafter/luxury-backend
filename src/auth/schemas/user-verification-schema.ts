import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class UserVerification {
  @Prop()
  emailVerificationCode: string;

  @Prop()
  phoneVerificationCode: string;

  @Prop()
  emailCodeSentAt: Date;

  @Prop()
  phoneCodeSentAt: Date;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isSignupCompleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;
}

export const UserVerificationSchema =
  SchemaFactory.createForClass(UserVerification);
