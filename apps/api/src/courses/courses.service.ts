import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Course } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prismaService: PrismaService) {}

  async course(
    courseWhereUniqueInput: Prisma.CourseWhereUniqueInput,
  ): Promise<Course | null> {
    return this.prismaService.course.findUnique({
      where: courseWhereUniqueInput,
      include: {
        instructor: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
        _count: {
          select: { Lesson: true, Enrollment: true },
        },
      },
    });
  }

  async courses(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.course.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
        _count: {
          select: { Lesson: true, Enrollment: true },
        },
      },
    });
  }

  async createCourse(data: Prisma.CourseCreateInput): Promise<Course> {
    // Validate that instructor and category exist before creating
    await this.validateCourseReferences(data);

    return this.prismaService.course.create({
      data,
      include: {
        instructor: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  private async validateCourseReferences(data: Prisma.CourseCreateInput) {
    // Check if instructor exists and has correct role
    if (data.instructor?.connect?.id) {
      const instructor = await this.prismaService.user.findUnique({
        where: { id: data.instructor.connect.id },
      });
      if (!instructor) {
        throw new NotFoundException('Instructor not found');
      }
      if (!['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(instructor.role)) {
        throw new NotFoundException(
          'User is not authorized to be an instructor',
        );
      }
    }

    // Check if category exists
    if (data.category?.connect?.id) {
      const category = await this.prismaService.category.findUnique({
        where: { id: data.category.connect.id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }
  }

  async updateCourse(params: {
    where: Prisma.CourseWhereUniqueInput;
    data: Prisma.CourseUpdateInput;
  }): Promise<Course> {
    const { where, data } = params;

    // Check if course exists before updating
    const existingCourse = await this.prismaService.course.findUnique({
      where,
    });
    if (!existingCourse) {
      throw new NotFoundException('Course not found');
    }

    return this.prismaService.course.update({
      where,
      data,
      include: {
        instructor: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<Course> {
    return this.prismaService.course.delete({
      where,
    });
  }
}
