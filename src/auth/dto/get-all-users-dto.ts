import { IsOptional } from 'class-validator';
import { Role } from '../types';
import { Transform } from 'class-transformer';

export class GetAllUsersDto {
  @IsOptional()
  readonly keyword: string;

  @IsOptional()
  readonly role: Role;

  @IsOptional()
  readonly limit: number;

  @IsOptional()
  readonly offset: number;
}
