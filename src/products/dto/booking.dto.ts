import {
  IsMongoId,
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaymentStatus } from '../entities/booking.entity';
import { PRODUCT_CODES } from '../../i18n/namespaces/product.namespace';

export class CreateBookingDto {
  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsMongoId({ message: PRODUCT_CODES.FIELD_REQUIRED })
  productId: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsString()
  productType: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsDateString({}, { message: PRODUCT_CODES.INVALID_DATE })
  startTime: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsDateString({}, { message: PRODUCT_CODES.INVALID_DATE })
  endTime: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsNumber({}, { message: PRODUCT_CODES.FIELD_REQUIRED })
  totalPrice: number;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsString()
  currency: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
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
  @IsEnum(PaymentStatus, { message: PRODUCT_CODES.FIELD_REQUIRED })
  paymentStatus: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
