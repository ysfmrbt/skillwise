import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [CoursesModule, UsersModule],
  providers: [EnrollmentsService, PrismaService],
  controllers: [EnrollmentsController],
})
export class EnrollmentsModule {}
