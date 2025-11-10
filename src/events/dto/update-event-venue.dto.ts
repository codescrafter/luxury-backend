import { PartialType } from '@nestjs/mapped-types';
import { CreateEventVenueDto } from './create-event-venue.dto';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const toBoolean = ({ value }: { value: any }) =>
  value === 'true' || value === true;

export class UpdateEventVenueDto extends PartialType(CreateEventVenueDto) {
  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  replaceImages?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
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
