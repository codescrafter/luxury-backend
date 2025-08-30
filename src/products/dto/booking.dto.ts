import {
  IsMongoId,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaymentStatus } from '../entities/booking.entity';

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

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
