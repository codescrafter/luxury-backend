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
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @IsString()
  @IsNotEmpty()
  descriptionEn: string;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  cityEn: string;

  @IsString()
  @IsNotEmpty()
  cityAr: string;

  @IsString()
  @IsNotEmpty()
  countryEn: string;

  @IsString()
  @IsNotEmpty()
  countryAr: string;

  @IsString()
  @IsNotEmpty()
  addressEn: string;

  @IsString()
  @IsNotEmpty()
  addressAr: string;

  @IsNumber()
  @Transform(toNumber)
  lat: number;

  @IsNumber()
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
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(phoneValidationRegex, {
    message: 'phone must be in E.164 format starting with +',
  })
  contactPhone?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isFeatured?: boolean;
}
