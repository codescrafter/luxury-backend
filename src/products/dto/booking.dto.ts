import { IsMongoId, IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBookingDto {
  @IsMongoId()
  productId: string;

  @IsString()
  productType: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  currency: string;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsNumber()
  adultsCount?: number;

  @IsOptional()
  @IsNumber()
  childrenCount?: number;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {} 