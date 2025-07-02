import { Transform } from 'class-transformer';
import { IsNotEmpty, Validate, IsEmail, IsPhoneNumber } from 'class-validator';
import { IsEmailOrPhoneConstraint } from 'src/helpers/dto-helpers';

export class ResendSignupCode {
  @IsNotEmpty({ message: 'The emailOrPhone field is required.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Validate(IsEmailOrPhoneConstraint)
  readonly emailOrPhone: string;
}

export class ResendSignupCodeDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;
}
