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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UserRole, Prisma } from 'generated/prisma';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
@UseGuards(AuthGuard, RolesGuard) // Apply both guards to the entire controller
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view courses
  async getAllCourses() {
    return this.coursesService.courses({});
  }

  @Get(':id')
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view a specific course
  async getCourse(@Param('id') id: string) {
    try {
      const course = await this.coursesService.course({ id });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can create courses
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    try {
      // Transform DTO to Prisma input format
      const courseData: Prisma.CourseCreateInput = {
        title: createCourseDto.title,
        description: createCourseDto.description,
        status: createCourseDto.status || 'DRAFT',
        instructor: {
          connect: { id: createCourseDto.instructorId },
        },
        category: {
          connect: { id: createCourseDto.categoryId },
        },
      };

      return await this.coursesService.createCourse(courseData);
    } catch (error) {
      // Handle Prisma-specific errors
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException(
          'A course with this information already exists',
        );
      }
      if (error.code === 'P2003') {
        // Foreign key constraint violation
        throw new BadRequestException(
          'Invalid instructor or category ID provided',
        );
      }
      if (error.code === 'P2025') {
        // Record not found
        throw new NotFoundException(
          'Referenced instructor or category not found',
        );
      }

      // Handle validation errors
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data format provided');
      }

      // Generic error handling
      throw new HttpException(
        'Failed to create course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can update courses
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    try {
      // Transform DTO to Prisma input format
      const updateData: Prisma.CourseUpdateInput = {
        ...(updateCourseDto.title && { title: updateCourseDto.title }),
        ...(updateCourseDto.description !== undefined && {
          description: updateCourseDto.description,
        }),
        ...(updateCourseDto.status && { status: updateCourseDto.status }),
        ...(updateCourseDto.instructorId && {
          instructor: { connect: { id: updateCourseDto.instructorId } },
        }),
        ...(updateCourseDto.categoryId && {
          category: { connect: { id: updateCourseDto.categoryId } },
        }),
      };

      return await this.coursesService.updateCourse({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Course not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Course with this information already exists',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Invalid instructor or category ID provided',
        );
      }
      throw new HttpException(
        'Failed to update course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only admins can delete courses
  async deleteCourse(@Param('id') id: string) {
    try {
      return await this.coursesService.deleteCourse({ id });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Course not found');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Cannot delete course: it has associated lessons or enrollments',
        );
      }
      throw new HttpException(
        'Failed to delete course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
