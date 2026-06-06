import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { AUTH_CODES } from '../../i18n/namespaces/auth.namespace';

export class SendSignUpRequestDto {
  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsEmail({}, { message: AUTH_CODES.INVALID_EMAIL_FORMAT })
  readonly email: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsPhoneNumber(undefined, { message: AUTH_CODES.INVALID_PHONE_FORMAT })
  readonly phone: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsString()
  @MinLength(6, { message: AUTH_CODES.PASSWORD_TOO_SHORT })
  readonly password: string;
}
