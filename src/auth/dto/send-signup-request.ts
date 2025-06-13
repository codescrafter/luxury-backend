import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsEmailOrPhoneConstraint } from 'src/helpers/dto-helpers';

export class SendSignUpRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty({ message: 'The emailOrPhone field is required.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Validate(IsEmailOrPhoneConstraint)
  readonly emailOrPhone: string;

  @IsNotEmpty({ message: 'The password field is required.' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  readonly password: string;
}
