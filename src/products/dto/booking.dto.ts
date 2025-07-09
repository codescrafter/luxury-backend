import { IsMongoId, IsString, IsEnum, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaymentStatus, BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsMongoId()
  consumerId: string;

  @IsMongoId()
  productId: string;

  @IsString()
  productType: string;

  @IsMongoId()
  partnerId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  currency: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsEnum(BookingStatus)
  bookingStatus: BookingStatus;

  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @IsOptional()
  @IsNumber()
  adultsCount?: number;

  @IsOptional()
  @IsNumber()
  childrenCount?: number;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {} 