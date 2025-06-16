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
import { FeedbackService } from './feedback.service';
import { UserRole, Prisma } from 'generated/prisma';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
@UseGuards(AuthGuard, RolesGuard) // Apply both guards to the entire controller
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only instructors and admins can view all feedback
  async getAllFeedback(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
    @Query('rating') rating?: string,
  ) {
    try {
      const params = {
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
        where: {
          ...(studentId && { studentId }),
          ...(courseId && { courseId }),
          ...(rating && { rating: parseInt(rating, 10) }),
        },
      };
      return await this.feedbackService.feedbacks(params);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve feedback',
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
  ) // Students can view their own feedback
  async getFeedbackByStudent(@Param('studentId') studentId: string) {
    try {
      return await this.feedbackService.feedbacksByStudent(studentId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve feedback for student',
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
  ) // All users can view course feedback
  async getFeedbackByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.feedbackService.feedbacksByCourse(courseId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve feedback for course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('course/:courseId/stats')
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view course rating stats
  async getCourseRatingStats(@Param('courseId') courseId: string) {
    try {
      return await this.feedbackService.getCourseRatingStats(courseId);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve course rating statistics',
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
  ) // All users can view specific feedback
  async getFeedback(@Param('id') id: string) {
    try {
      const feedback = await this.feedbackService.feedback(id);
      if (!feedback) {
        throw new NotFoundException('Feedback not found');
      }
      return feedback;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Students can create feedback, admins can create on behalf
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    try {
      // Transform DTO to Prisma input format
      const feedbackData: Prisma.FeedbackCreateInput = {
        rating: createFeedbackDto.rating,
        comment: createFeedbackDto.comment,
        student: {
          connect: { id: createFeedbackDto.studentId },
        },
        course: {
          connect: { id: createFeedbackDto.courseId },
        },
      };

      return await this.feedbackService.createFeedback(feedbackData);
    } catch (error) {
      // Handle Prisma-specific errors
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
        'Failed to create feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Students can update their own feedback
  async updateFeedback(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    try {
      // Transform DTO to Prisma input format
      const updateData: Prisma.FeedbackUpdateInput = {
        ...(updateFeedbackDto.rating && { rating: updateFeedbackDto.rating }),
        ...(updateFeedbackDto.comment !== undefined && {
          comment: updateFeedbackDto.comment,
        }),
      };

      return await this.feedbackService.updateFeedback({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Feedback not found');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN) // Students can delete their own feedback
  async deleteFeedback(@Param('id') id: string) {
    try {
      return await this.feedbackService.deleteFeedback({ id });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Feedback not found');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
