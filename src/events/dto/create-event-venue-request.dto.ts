import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { phoneValidationRegex } from 'src/helpers/dto-helpers';
import { EVENT_CODES } from '../../i18n/namespaces/event.namespace';

export class CreateEventVenueRequestDto {
  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  @IsString()
  name: string;

  @IsEmail({}, { message: EVENT_CODES.INVALID_EMAIL })
  email: string;

  @IsString()
  @Matches(phoneValidationRegex, {
    message: EVENT_CODES.INVALID_PHONE,
  })
  phone: string;

  @IsNotEmpty({ message: EVENT_CODES.FIELD_REQUIRED })
  @IsString()
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
