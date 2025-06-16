import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [CategoriesModule, UsersModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
