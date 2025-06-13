import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    MaxLength,
    MinLength,
    Validate
  } from 'class-validator';
import { IsEmailOrPhoneConstraint } from 'src/helpers/dto-helpers';

  
  export class VerifyAccountDto {
    @IsNotEmpty({ message: 'The emailOrPhone field is required.' })
    @Transform(({ value }) => value.trim().toLowerCase())
    @Validate(IsEmailOrPhoneConstraint)
    readonly emailOrPhone: string;

    @IsNotEmpty({ message: 'The code field is required.' })
    @MaxLength(6, { message: 'The code must be 6 characters long.' })
    @MinLength(6, { message: 'The code must be 6 characters long.' })
    readonly code: string;
  }
  