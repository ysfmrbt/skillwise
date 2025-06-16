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
import { CategoriesService } from './categories.service';
import { UserRole, Prisma } from 'generated/prisma';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseGuards(AuthGuard, RolesGuard) // Apply both guards to the entire controller
@UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(
    UserRole.STUDENT,
    UserRole.INSTRUCTOR,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ) // All users can view categories
  async getAllCategories(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    try {
      const params = {
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
        where: search
          ? {
              name: {
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            }
          : undefined,
      };
      return await this.categoriesService.categories(params);
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve categories',
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
  ) // All users can view a specific category
  async getCategory(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.category(id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only admins can create categories
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      // Check if category with this name already exists
      const existingCategory = await this.categoriesService.categoryByName(
        createCategoryDto.name,
      );
      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }

      const categoryData: Prisma.CategoryCreateInput = {
        name: createCategoryDto.name,
      };

      return await this.categoriesService.createCategory(categoryData);
    } catch (error) {
      // Handle Prisma-specific errors
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException('Category with this name already exists');
      }

      // Handle validation errors
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid data format provided');
      }

      // Handle custom exceptions
      if (error instanceof ConflictException) {
        throw error;
      }

      // Generic error handling
      throw new HttpException(
        'Failed to create category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN) // Only admins can update categories
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      // Check if another category with the same name exists (if name is being updated)
      if (updateCategoryDto.name) {
        const existingCategory = await this.categoriesService.categoryByName(
          updateCategoryDto.name,
        );
        if (existingCategory && existingCategory.id !== id) {
          throw new ConflictException('Category with this name already exists');
        }
      }

      const updateData: Prisma.CategoryUpdateInput = {
        ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
      };

      return await this.categoriesService.updateCategory({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Category with this name already exists');
      }
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to update category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN) // Only super admins can delete categories
  async deleteCategory(@Param('id') id: string) {
    try {
      return await this.categoriesService.deleteCategory({ id });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Cannot delete category: it has associated courses. Please reassign or delete the courses first.',
        );
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
