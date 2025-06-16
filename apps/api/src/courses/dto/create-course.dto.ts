import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { CourseStatus } from 'generated/prisma';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus = CourseStatus.DRAFT;
}
