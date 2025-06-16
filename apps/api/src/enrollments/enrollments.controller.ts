import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { EnrollmentsService } from './enrollments.service';
import { UserRole, Prisma } from 'generated/prisma';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
@UseGuards(AuthGuard, RolesGuard) // Apply both guards to the entire controller
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can view all enrollments
  async getAllEnrollments(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ) {
    try {
      const params = {
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
        where: {
          ...(studentId && { studentId }),
          ...(courseId && { courseId }),
        },
      };
      return await this.enrollmentsService.enrollments(params);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve enrollments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('student/:studentId')
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // Students can view their own enrollments
  async getEnrollmentsByStudent(@Param('studentId') studentId: string) {
    try {
      return await this.enrollmentsService.enrollmentsByStudent(studentId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve enrollments for student',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('course/:courseId')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can view course enrollments
  async getEnrollmentsByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.enrollmentsService.enrollmentsByCourse(courseId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve enrollments for course',
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
  ) // All users can view specific enrollment
  async getEnrollment(@Param('id') id: string) {
    try {
      const enrollment = await this.enrollmentsService.enrollment(id);
      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }
      return enrollment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve enrollment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Students can enroll themselves, admins can enroll anyone
  async createEnrollment(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    try {
      // Transform DTO to Prisma input format
      const enrollmentData: Prisma.EnrollmentCreateInput = {
        student: {
          connect: { id: createEnrollmentDto.studentId },
        },
        course: {
          connect: { id: createEnrollmentDto.courseId },
        },
      };

      return await this.enrollmentsService.createEnrollment(enrollmentData);
    } catch (error) {
      // Handle Prisma-specific errors
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException(
          'Student is already enrolled in this course',
        );
      }
      if (error.code === 'P2003') {
        // Foreign key constraint violation
        throw new BadRequestException('Invalid student or course ID provided');
      }
      if (error.code === 'P2025') {
        // Record not found
        throw new NotFoundException('Referenced student or course not found');
      }

      // Handle validation errors
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data format provided');
      }

      // Handle custom exceptions
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Generic error handling
      throw new HttpException(
        'Failed to create enrollment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Students can unenroll themselves, admins can unenroll anyone
  async deleteEnrollment(@Param('id') id: string) {
    try {
      return await this.enrollmentsService.deleteEnrollment({ id });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Enrollment not found');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete enrollment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
