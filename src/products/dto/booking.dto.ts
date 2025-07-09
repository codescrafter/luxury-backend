import { IsMongoId, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export enum BookingProductType {
  JETSKI = 'jetski',
  KAYAK = 'kayak',
  SPEEDBOAT = 'speedboat',
  YACHT = 'yacht',
  RESORT = 'resort',
}

/**
 * If date is not provided, defaults to today. startHour/endHour are for non-resort products only.
 */
export class CreateBookingDto {
  @IsMongoId()
  productId: string;

  @IsEnum(BookingProductType)
  productType: BookingProductType;

  @IsDateString()
  date: string;

  // For per-hour bookings
  @IsOptional()
  @IsNumber()
  startHour?: number;

  @IsOptional()
  @IsNumber()
  endHour?: number;
} 