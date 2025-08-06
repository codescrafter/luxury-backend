import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  emailCode?: string;

  @IsOptional()
  @IsString()
  phoneCode?: string;

  @IsOptional()
  @IsEnum(['en', 'ar'])
  language?: string;
}
