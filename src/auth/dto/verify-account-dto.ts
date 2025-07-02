import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
export class VerifyAccountDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;

  @IsNotEmpty()
  @MaxLength(6, { message: 'The emailCode must be 6 characters long.' })
  @MinLength(6, { message: 'The emailCode must be 6 characters long.' })
  readonly emailCode: string;

  @IsNotEmpty()
  @MaxLength(6, { message: 'The phoneCode must be 6 characters long.' })
  @MinLength(6, { message: 'The phoneCode must be 6 characters long.' })
  readonly phoneCode: string;
}
