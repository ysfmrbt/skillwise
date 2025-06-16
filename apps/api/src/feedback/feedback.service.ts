import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Feedback } from 'generated/prisma';

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  async feedbacks(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FeedbackWhereUniqueInput;
    where?: Prisma.FeedbackWhereInput;
    orderBy?: Prisma.FeedbackOrderByWithRelationInput;
  }): Promise<Feedback[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prismaService.feedback.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async feedback(id: string): Promise<Feedback | null> {
    return this.prismaService.feedback.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            instructor: {
              select: { id: true, name: true, email: true },
            },
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async feedbacksByStudent(studentId: string): Promise<Feedback[]> {
    return this.prismaService.feedback.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async feedbacksByCourse(courseId: string): Promise<Feedback[]> {
    return this.prismaService.feedback.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getCourseRatingStats(courseId: string) {
    const feedbacks = await this.prismaService.feedback.findMany({
      where: { courseId },
      select: { rating: true },
    });

    if (feedbacks.length === 0) {
      return {
        averageRating: 0,
        totalFeedbacks: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0,
    );
    const averageRating = totalRating / feedbacks.length;

    const ratingDistribution = feedbacks.reduce(
      (dist, feedback) => {
        dist[feedback.rating] = (dist[feedback.rating] || 0) + 1;
        return dist;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    );

    return {
      averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      totalFeedbacks: feedbacks.length,
      ratingDistribution,
    };
  }

  async createFeedback(data: Prisma.FeedbackCreateInput): Promise<Feedback> {
    // Validate that student and course exist before creating feedback
    await this.validateFeedbackReferences(data);

    return this.prismaService.feedback.create({
      data,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async updateFeedback(params: {
    where: Prisma.FeedbackWhereUniqueInput;
    data: Prisma.FeedbackUpdateInput;
  }): Promise<Feedback> {
    const { where, data } = params;

    // Check if feedback exists before updating
    const existingFeedback = await this.prismaService.feedback.findUnique({
      where,
    });
    if (!existingFeedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.prismaService.feedback.update({
      where,
      data,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async deleteFeedback(
    where: Prisma.FeedbackWhereUniqueInput,
  ): Promise<Feedback> {
    // Check if feedback exists before deleting
    const existingFeedback = await this.prismaService.feedback.findUnique({
      where,
    });
    if (!existingFeedback) {
      throw new NotFoundException('Feedback not found');
    }

    return this.prismaService.feedback.delete({
      where,
    });
  }

  private async validateFeedbackReferences(data: Prisma.FeedbackCreateInput) {
    // Check if student exists
    if (data.student?.connect?.id) {
      const student = await this.prismaService.user.findUnique({
        where: { id: data.student.connect.id },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      if (student.role !== 'STUDENT') {
        throw new NotFoundException('User is not a student');
      }
    }

    // Check if course exists
    if (data.course?.connect?.id) {
      const course = await this.prismaService.course.findUnique({
        where: { id: data.course.connect.id },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }

    // Check if student is enrolled in the course
    if (data.student?.connect?.id && data.course?.connect?.id) {
      const enrollment = await this.prismaService.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: data.student.connect.id,
            courseId: data.course.connect.id,
          },
        },
      });

      if (!enrollment) {
        throw new ConflictException(
          'Student must be enrolled in the course to provide feedback',
        );
      }
    }
  }
}
