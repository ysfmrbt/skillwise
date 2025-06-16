import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Length,
} from 'class-validator';
import { LessonType } from 'generated/prisma';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 200, {
    message: 'Lesson title must be between 2 and 200 characters',
  })
  title: string;

  @IsString()
  @IsOptional()
  @Length(10, 5000, {
    message: 'Lesson content must be between 10 and 5000 characters',
  })
  content?: string;

  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType = LessonType.VIDEO;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}
