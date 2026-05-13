import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UnifiedLoginDto {
  @IsNotEmpty({ message: 'The identifier field is required.' })
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  readonly identifier: string;

  @IsNotEmpty({ message: 'The password field is required.' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  readonly password: string;
}
