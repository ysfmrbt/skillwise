import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Enrollment } from 'generated/prisma';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async enrollments(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EnrollmentWhereUniqueInput;
    where?: Prisma.EnrollmentWhereInput;
    orderBy?: Prisma.EnrollmentOrderByWithRelationInput;
  }): Promise<Enrollment[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prismaService.enrollment.findMany({
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
            role: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
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

  async enrollment(id: string): Promise<Enrollment | null> {
    return this.prismaService.enrollment.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            instructor: {
              select: { id: true, name: true, email: true },
            },
            category: {
              select: { id: true, name: true },
            },
            _count: {
              select: { Lesson: true },
            },
          },
        },
      },
    });
  }

  async enrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return this.prismaService.enrollment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            instructor: {
              select: { id: true, name: true },
            },
            category: {
              select: { id: true, name: true },
            },
            _count: {
              select: { Lesson: true },
            },
          },
        },
      },
    });
  }

  async enrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return this.prismaService.enrollment.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async createEnrollment(
    data: Prisma.EnrollmentCreateInput,
  ): Promise<Enrollment> {
    // Validate that student and course exist before creating enrollment
    await this.validateEnrollmentReferences(data);

    // Check if enrollment already exists
    if (data.student?.connect?.id && data.course?.connect?.id) {
      const existingEnrollment = await this.prismaService.enrollment.findUnique(
        {
          where: {
            studentId_courseId: {
              studentId: data.student.connect.id,
              courseId: data.course.connect.id,
            },
          },
        },
      );

      if (existingEnrollment) {
        throw new ConflictException(
          'Student is already enrolled in this course',
        );
      }
    }

    return this.prismaService.enrollment.create({
      data,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
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

  async deleteEnrollment(
    where: Prisma.EnrollmentWhereUniqueInput,
  ): Promise<Enrollment> {
    // Check if enrollment exists before deleting
    const existingEnrollment = await this.prismaService.enrollment.findUnique({
      where,
    });
    if (!existingEnrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return this.prismaService.enrollment.delete({
      where,
    });
  }

  private async validateEnrollmentReferences(
    data: Prisma.EnrollmentCreateInput,
  ) {
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

    // Check if course exists and is published
    if (data.course?.connect?.id) {
      const course = await this.prismaService.course.findUnique({
        where: { id: data.course.connect.id },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      if (course.status !== 'PUBLISHED') {
        throw new ConflictException('Cannot enroll in unpublished course');
      }
    }
  }
}
