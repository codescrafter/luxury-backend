import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

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

  @Prop({ default: false })
  isPartnerApplicationSubmitted: boolean;

  @Prop({ default: false })
  isPartnerApplicationApproved: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const UserVerificationSchema =
  SchemaFactory.createForClass(UserVerification);
