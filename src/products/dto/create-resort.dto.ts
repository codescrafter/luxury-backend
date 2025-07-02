import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResortDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsBoolean()
  isDailyRental: boolean;

  @IsBoolean()
  isAnnualRental: boolean;
}
