import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RentalConditionsDto } from './rental-conditions.dto';

export class CreateSpeedboatDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isRental: boolean;

  @IsBoolean()
  isEventProperty: boolean;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsOptional()
  @IsString()
  resortId?: string;

  @IsOptional()
  rentalConditions?: RentalConditionsDto;

  @IsOptional()
  tags?: string[];
}
