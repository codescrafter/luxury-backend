import { IsEnum, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, IsDateString } from 'class-validator';
import { NotificationType, NotificationAction, RecipientType } from '../enums/notification.enum';

export class CreateNotificationDto {
  @IsEnum(RecipientType)
  @IsNotEmpty()
  recipientType: RecipientType;

  @IsMongoId()
  @IsOptional()
  recipientId?: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsEnum(NotificationAction)
  @IsNotEmpty()
  action: NotificationAction;

  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @IsString()
  @IsNotEmpty()
  bodyEn: string;

  @IsString()
  @IsNotEmpty()
  bodyAr: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsMongoId()
  @IsOptional()
  actorId?: string;

  @IsMongoId()
  @IsOptional()
  entityId?: string;

  @IsString()
  @IsOptional()
  entityModel?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: Date;
}
