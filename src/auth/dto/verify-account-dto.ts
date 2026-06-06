import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AUTH_CODES } from '../../i18n/namespaces/auth.namespace';

export class VerifyAccountDto {
  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsEmail({}, { message: AUTH_CODES.INVALID_EMAIL_FORMAT })
  readonly email: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsPhoneNumber(undefined, { message: AUTH_CODES.INVALID_PHONE_FORMAT })
  readonly phone: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @MinLength(6, { message: AUTH_CODES.CODE_INVALID_LENGTH })
  @MaxLength(6, { message: AUTH_CODES.CODE_INVALID_LENGTH })
  readonly emailCode: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @MinLength(6, { message: AUTH_CODES.CODE_INVALID_LENGTH })
  @MaxLength(6, { message: AUTH_CODES.CODE_INVALID_LENGTH })
  readonly phoneCode: string;
}
