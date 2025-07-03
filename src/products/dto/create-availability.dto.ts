import { IsMongoId, IsDateString, IsEnum } from 'class-validator';

export class CreateAvailabilityDto {
  @IsMongoId()
  productId: string;

  @IsDateString()
  date: string;

  @IsEnum(['unavailable', 'booked'])
  status: 'unavailable' | 'booked';
} 