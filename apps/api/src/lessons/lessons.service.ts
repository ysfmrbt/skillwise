import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Lesson } from 'generated/prisma';

@Injectable()
export class LessonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async lessons(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LessonWhereUniqueInput;
    where?: Prisma.LessonWhereInput;
    orderBy?: Prisma.LessonOrderByWithRelationInput;
  }): Promise<Lesson[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prismaService.lesson.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy || { createdAt: 'asc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async lesson(id: string): Promise<Lesson | null> {
    return this.prismaService.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            status: true,
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

  async lessonsByCourse(courseId: string): Promise<Lesson[]> {
    return this.prismaService.lesson.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async createLesson(data: Prisma.LessonCreateInput): Promise<Lesson> {
    // Validate that course exists before creating lesson
    await this.validateCourseExists(data);

    return this.prismaService.lesson.create({
      data,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async updateLesson(params: {
    where: Prisma.LessonWhereUniqueInput;
    data: Prisma.LessonUpdateInput;
  }): Promise<Lesson> {
    const { where, data } = params;

    // Check if lesson exists before updating
    const existingLesson = await this.prismaService.lesson.findUnique({
      where,
    });
    if (!existingLesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prismaService.lesson.update({
      where,
      data,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  async deleteLesson(where: Prisma.LessonWhereUniqueInput): Promise<Lesson> {
    // Check if lesson exists before deleting
    const existingLesson = await this.prismaService.lesson.findUnique({
      where,
    });
    if (!existingLesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prismaService.lesson.delete({
      where,
    });
  }

  private async validateCourseExists(data: Prisma.LessonCreateInput) {
    if (data.course?.connect?.id) {
      const course = await this.prismaService.course.findUnique({
        where: { id: data.course.connect.id },
      });
      if (!course) {
        throw new NotFoundException('Course not found');
      }
    }
  }
}
