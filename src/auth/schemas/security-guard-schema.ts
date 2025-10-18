import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type SecurityGuardDocument = SecurityGuard & Document;

export enum SecurityGuardStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class SecurityGuard {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  partnerId: Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  assignedProductIds: Types.ObjectId[];

  @Prop({ enum: SecurityGuardStatus, default: SecurityGuardStatus.ACTIVE })
  status: SecurityGuardStatus;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  createdBy: Types.ObjectId; // Partner who created this security guard

  @Prop({ default: 'en', enum: ['en', 'ar'] })
  language: string;
}

export const SecurityGuardSchema = SchemaFactory.createForClass(SecurityGuard);

// Indexes for efficient queries
SecurityGuardSchema.index({ username: 1 });
SecurityGuardSchema.index({ email: 1 });
SecurityGuardSchema.index({ partnerId: 1 });
SecurityGuardSchema.index({ status: 1 });
