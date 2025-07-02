import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RentalConditionsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pricePerHour?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  securityDeposit?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  fuelIncluded?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  insuranceIncluded?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  licenseRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ageRequirement?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  cancellationPolicy?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  termsAndConditions?: string[];
}
