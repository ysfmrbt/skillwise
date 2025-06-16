import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CourseStatus } from 'generated/prisma';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  instructorId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}
