import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { RentalConditionsDto } from './rental-conditions.dto';

export class CreateJetskiDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  isRental: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  isEventProperty: boolean;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsOptional()
  @IsString()
  resortId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RentalConditionsDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return plainToInstance(RentalConditionsDto, JSON.parse(value));
      } catch (e) {
        return {}; // force validation to fail
      }
    }
    return value;
  })
  rentalConditions?: RentalConditionsDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Jetski-specific fields
  @IsString()
  @IsNotEmpty()
  engineType: string;

  @IsString()
  @IsNotEmpty()
  enginePower: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  maxSpeed: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  seatingCapacity: number;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  modelYear?: number;

  @IsOptional()
  @IsString()
  jetskiType?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  lifeJacketsIncluded?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minimumHours?: number;

  @IsOptional()
  @IsString()
  maintenanceNotes?: string;
}
