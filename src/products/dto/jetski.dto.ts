import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateJetskiDto {
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

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerHour: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerDay: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  securityDeposit: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  fuelIncluded: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  insuranceIncluded: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  licenseRequired: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  ageRequirement: number;

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  cancellationPolicyEn: string[];

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  cancellationPolicyAr: string[];

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  termsAndConditionsEn: string[];

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  termsAndConditionsAr: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  tagsEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  tagsAr?: string[];

  @IsString()
  engineType: string;

  @IsString()
  enginePower: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  maxSpeed: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  capacity: number;

  @IsString()
  brand: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  modelYear?: number;

  @IsOptional()
  @IsString()
  jetskiType?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  lifeJacketsIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  minimumHours?: number;

  @IsOptional()
  @IsString()
  maintenanceNotes?: string;

  @IsMongoId()
  ownerId: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
  
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsString()
  cityEn: string;

  @IsString()
  cityAr: string;

  @IsString()
  regionEn: string;

  @IsString()
  regionAr: string;

  @IsString()
  countryEn: string;

  @IsString()
  countryAr: string;

  @IsString()
  addressEn: string;

  @IsString()
  addressAr: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  reviewCount?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  totalBookings?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  resubmissionCount?: number;
}

export class UpdateJetskiDto extends PartialType(CreateJetskiDto) {}

