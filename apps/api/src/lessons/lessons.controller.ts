import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { UserRole, Prisma } from 'generated/prisma';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
@UseGuards(AuthGuard, RolesGuard) // Apply both guards to the entire controller
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view lessons
  async getAllLessons(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('courseId') courseId?: string,
    @Query('type') type?: string,
  ) {
    try {
      const params = {
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
        where: {
          ...(courseId && { courseId }),
          ...(type && { type: type as any }),
        },
      };
      return await this.lessonsService.lessons(params);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve lessons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('course/:courseId')
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view lessons by course
  async getLessonsByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.lessonsService.lessonsByCourse(courseId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve lessons for course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view a specific lesson
  async getLesson(@Param('id') id: string) {
    try {
      const lesson = await this.lessonsService.lesson(id);
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      return lesson;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can create lessons
  async createLesson(@Body() createLessonDto: CreateLessonDto) {
    try {
      // Transform DTO to Prisma input format
      const lessonData: Prisma.LessonCreateInput = {
        title: createLessonDto.title,
        content: createLessonDto.content,
        type: createLessonDto.type || 'VIDEO',
        course: {
          connect: { id: createLessonDto.courseId },
        },
      };

      return await this.lessonsService.createLesson(lessonData);
    } catch (error) {
      // Handle Prisma-specific errors
      if (error.code === 'P2003') {
        // Foreign key constraint violation
        throw new BadRequestException('Invalid course ID provided');
      }
      if (error.code === 'P2025') {
        // Record not found
        throw new NotFoundException('Referenced course not found');
      }

      // Handle validation errors
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data format provided');
      }

      // Handle custom exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Generic error handling
      throw new HttpException(
        'Failed to create lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can update lessons
  async updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    try {
      // Transform DTO to Prisma input format
      const updateData: Prisma.LessonUpdateInput = {
        ...(updateLessonDto.title && { title: updateLessonDto.title }),
        ...(updateLessonDto.content !== undefined && {
          content: updateLessonDto.content,
        }),
        ...(updateLessonDto.type && { type: updateLessonDto.type }),
        ...(updateLessonDto.courseId && {
          course: { connect: { id: updateLessonDto.courseId } },
        }),
      };

      return await this.lessonsService.updateLesson({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Lesson not found');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid course ID provided');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can delete lessons
  async deleteLesson(@Param('id') id: string) {
    try {
      return await this.lessonsService.deleteLesson({ id });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Lesson not found');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
