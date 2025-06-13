import { IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsObject, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  pricePerDay: number;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsObject()
  @IsOptional()
  amenities?: Record<string, any>;

  @IsObject()
  @IsOptional()
  includedServices?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsUUID()
  categoryId: string;
} 