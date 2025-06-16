import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Category } from 'generated/prisma';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async categories(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CategoryWhereUniqueInput;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<Category[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prismaService.category.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy || { name: 'asc' },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async category(id: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            status: true,
            instructor: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prismaService.category.create({
      data,
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async updateCategory(params: {
    where: Prisma.CategoryWhereUniqueInput;
    data: Prisma.CategoryUpdateInput;
  }): Promise<Category> {
    const { where, data } = params;

    // Check if category exists before updating
    const existingCategory = await this.prismaService.category.findUnique({
      where,
    });
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    return this.prismaService.category.update({
      where,
      data,
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async deleteCategory(
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    // Check if category exists before deleting
    const existingCategory = await this.prismaService.category.findUnique({
      where,
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    return this.prismaService.category.delete({
      where,
    });
  }

  async categoryByName(name: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { name },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }
}
