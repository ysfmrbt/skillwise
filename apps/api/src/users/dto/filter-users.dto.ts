import { IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'generated/prisma';

export class FilterUsersDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  search?: string;
}
