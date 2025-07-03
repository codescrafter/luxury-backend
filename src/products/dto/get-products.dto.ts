import { IsOptional, IsString, IsNumber, IsArray, IsEnum, IsDateString, Min, Max, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum ProductType {
  JETSKI = 'jetski',
  KAYAK = 'kayak',
  YACHT = 'yacht',
  SPEEDBOAT = 'speedboat',
  RESORT = 'resort',
  ALL = 'all'
}

export enum SortBy {
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  RATING = 'rating',
  REVIEWS = 'reviews',
  BOOKINGS = 'bookings',
  CREATED_AT = 'created_at',
  FEATURED = 'featured'
}

export class GetProductsDto {
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType = ProductType.ALL;

  // Date range for availability filtering
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  // Location filters
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  country?: string;

  // Capacity and pricing filters
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numberOfPeople?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxSecurityDeposit?: number;

  // Rating and reviews filters
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minReviewCount?: number;

  // Product-specific filters
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  engineType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minEnginePower?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxSpeed?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  modelYear?: number;

  // Boolean filters
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  fuelIncluded?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  insuranceIncluded?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  licenseRequired?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  lifeJacketsIncluded?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isRental?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isEventProperty?: boolean;

  // Tags and search
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  search?: string;

  // Sorting and pagination
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.CREATED_AT;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // Status filter (for admin/partner use)
  @IsOptional()
  @IsString()
  status?: 'pending' | 'approved' | 'rejected';

  // Owner filter (for partner use)
  @IsOptional()
  @IsString()
  ownerId?: string;
} 