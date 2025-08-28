import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsEmailOrPhoneConstraint } from 'src/helpers/dto-helpers';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'The emailOrPhone field is required.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Validate(IsEmailOrPhoneConstraint)
  readonly emailOrPhone: string;

  @IsOptional()
  @IsString()
  readonly verificationCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  readonly password?: string;
}
