import {
  IsMongoId,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { PRODUCT_CODES } from '../../i18n/namespaces/product.namespace';

export enum UnavailabilityType {
  PARTNER_BLOCKED = 'partner_blocked',
  BOOKED = 'booked',
}

export class CreateUnavailabilityDto {
  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsMongoId({ message: PRODUCT_CODES.FIELD_REQUIRED })
  productId: string;

  @IsOptional()
  @IsMongoId()
  consumerId?: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsString()
  productType: string;

  @IsEnum(UnavailabilityType, { message: PRODUCT_CODES.FIELD_REQUIRED })
  unavailabilityType: UnavailabilityType;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsDateString({}, { message: PRODUCT_CODES.INVALID_DATE })
  startTime: string;

  @IsNotEmpty({ message: PRODUCT_CODES.FIELD_REQUIRED })
  @IsDateString({}, { message: PRODUCT_CODES.INVALID_DATE })
  endTime: string;
}
