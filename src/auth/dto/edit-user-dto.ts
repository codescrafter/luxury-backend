import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  readonly email: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  readonly phone: string;

  @IsOptional()
  readonly emailCode: string;

  @IsOptional()
  readonly phoneCode: string;
}
