import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { phoneValidationRegex } from 'src/helpers/dto-helpers';

export class CreateEventVenueRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(phoneValidationRegex, {
    message: 'phone must be in E.164 format starting with +',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  preferredEventDate?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  preferredGuestCount?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  budgetNotes?: string;
}
