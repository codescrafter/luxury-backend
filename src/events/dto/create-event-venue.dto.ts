import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { phoneValidationRegex } from 'src/helpers/dto-helpers';
import { EVENT_CODES } from '../../i18n/namespaces/event.namespace';

const toArray = (value: any) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string')
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  return undefined;
};

const toBoolean = ({ value }: { value: any }) =>
  value === 'true' || value === true;

const toNumber = ({ value }: { value: any }) =>
  value !== undefined && value !== null && value !== ''
    ? Number(value)
    : undefined;

export class CreateEventVenueDto {
  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  titleEn: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  titleAr: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  descriptionEn: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  descriptionAr: string;

  @IsOptional()
  @IsNumber()
  @Transform(toNumber)
  guestCapacity?: number;

  @IsOptional()
  @IsNumber()
  @Transform(toNumber)
  minimumGuests?: number;

  @IsOptional()
  @IsNumber()
  @Transform(toNumber)
  maximumGuests?: number;

  @IsOptional()
  @IsNumber()
  @Transform(toNumber)
  areaInSqM?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isIndoor?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isOutdoor?: boolean;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => toArray(value))
  @IsString({ each: true })
  tagsEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => toArray(value))
  @IsString({ each: true })
  tagsAr?: string[];

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  cityEn: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  cityAr: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  countryEn: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  countryAr: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  addressEn: string;

  @IsString()
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  addressAr: string;

  @IsNumber({}, { message: EVENT_CODES.INVALID_COORDINATES })
  @Transform(toNumber)
  lat: number;

  @IsNumber({}, { message: EVENT_CODES.INVALID_COORDINATES })
  @Transform(toNumber)
  lng: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => toArray(value))
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => toArray(value))
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsEmail({}, { message: EVENT_CODES.INVALID_EMAIL })
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(phoneValidationRegex, {
    message: EVENT_CODES.INVALID_PHONE,
  })
  contactPhone?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isFeatured?: boolean;
}
