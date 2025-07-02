import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { RentalConditionsDto } from './rental-conditions.dto';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isRental?: boolean;

  @IsOptional()
  @IsBoolean()
  isEventProperty?: boolean;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsString()
  resortId?: string;

  @IsOptional()
  rentalConditions?: RentalConditionsDto;

  @IsOptional()
  tags?: string[];
}
