import { IsMongoId, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum UnavailabilityType {
  PARTNER_BLOCKED = 'partner_blocked',
  BOOKED = 'booked',
}

export class CreateUnavailabilityDto {
  @IsMongoId()
  productId: string;

  @IsOptional()
  @IsMongoId()
  consumerId?: string;

  @IsString()
  productType: string;

  @IsEnum(UnavailabilityType)
  unavailabilityType: UnavailabilityType;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
} 