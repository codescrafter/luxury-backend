import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateResortDto {
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

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAnnualResort: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDailyResort: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  canHostEvent: boolean;

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // @Transform(({ value }) => value ? JSON.parse(value) : undefined)
  // amenities?: string[];
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter((item) => item.length > 0);
  })
  @IsString({ each: true })
  amenitiesEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    return value
      .split(',')
      .map((item: string) => item.trim())
      .filter((item) => item.length > 0);
  })
  @IsString({ each: true })
  amenitiesAr?: string[];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  numberOfRooms?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  numberOfBathrooms?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  totalAreaInSqFt?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  starRating?: number;

  @ValidateIf((o) => o.isDailyResort === true)
  @IsNumber()
  @IsNotEmpty({
    message: 'Daily price is required when resort is marked as daily',
  })
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  dailyPrice?: number;

  @ValidateIf((o) => o.isAnnualResort === true)
  @IsNumber()
  @IsNotEmpty({
    message: 'Yearly price is required when resort is marked as annual',
  })
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  yearlyPrice?: number;

  @IsOptional()
  @IsString()
  checkInTime?: string;

  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  petFriendly?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  smokingAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  parkingAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  wifiAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  cancellationPolicyEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  cancellationPolicyAr?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  termsAndConditionsEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  termsAndConditionsAr?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  safetyFeaturesEn?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  safetyFeaturesAr?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  insuranceProvided?: boolean;

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
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    // If already an array, return as is
    if (Array.isArray(value)) return value;
    // Else split by comma and trim each item
    return value.split(',').map((id: string) => id.trim());
  })
  @IsArray()
  @IsMongoId({ each: true }) // validates each array element as a MongoDB ObjectId
  availableProducts?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  reviewCount?: number;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  resubmissionCount?: number;
}

export class UpdateResortDto extends PartialType(CreateResortDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  replaceImages?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  replaceVideos?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleteImageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deleteVideoUrls?: string[];
}
