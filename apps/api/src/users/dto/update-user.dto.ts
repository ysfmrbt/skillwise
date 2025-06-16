import {
  IsOptional,
  IsEnum,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';
import { UserRole } from 'generated/prisma';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
