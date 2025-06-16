import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [CoursesModule, UsersModule],
  providers: [LessonsService, PrismaService],
  controllers: [LessonsController],
})
export class LessonsModule {}
