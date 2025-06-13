import { Transform } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsEmailOrPhoneConstraint } from 'src/helpers/dto-helpers';

export class ResendSignupCode {
  @IsNotEmpty({ message: 'The emailOrPhone field is required.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Validate(IsEmailOrPhoneConstraint)
  readonly emailOrPhone: string;
}
