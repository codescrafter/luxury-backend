import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  IsEnum,
  MinLength,
  IsMongoId,
} from 'class-validator';
import { SecurityGuardStatus } from '../schemas/security-guard-schema';

export class CreateSecurityGuardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  assignedProductIds?: string[];
}

export class UpdateSecurityGuardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  assignedProductIds?: string[];

  @IsEnum(SecurityGuardStatus)
  @IsOptional()
  status?: SecurityGuardStatus;
}

export class SecurityGuardLoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GetSecurityGuardsQueryDto {
  @IsOptional()
  @IsEnum(SecurityGuardStatus)
  status?: SecurityGuardStatus;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
