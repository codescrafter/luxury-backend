import { IsMongoId, IsDateString, IsOptional, IsNumber } from 'class-validator';

/**
 * If startDate/endDate are not provided, defaults to today + next 6 days.
 * startHour/endHour are for non-resort products only.
 */
export class CreateUnavailabilityDto {
  /**
   * Set by controller from URL param
   */
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  startHour?: number;

  @IsOptional()
  @IsNumber()
  endHour?: number;
} 