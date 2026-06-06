import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsEmailOrPhoneConstraint } from 'src/helpers/dto-helpers';
import { AUTH_CODES } from '../../i18n/namespaces/auth.namespace';

export class LoginDto {
  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Validate(IsEmailOrPhoneConstraint, { message: AUTH_CODES.INVALID_EMAIL_OR_PHONE })
  readonly emailOrPhone: string;

  @IsNotEmpty({ message: AUTH_CODES.FIELD_REQUIRED })
  @IsString()
  @MinLength(6, { message: AUTH_CODES.PASSWORD_TOO_SHORT })
  readonly password: string;
}
