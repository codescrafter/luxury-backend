import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class LocationDto {
  @IsNumber()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;
  
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lng: number;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsString()
  country: string;

  @IsString()
  address: string;
}
