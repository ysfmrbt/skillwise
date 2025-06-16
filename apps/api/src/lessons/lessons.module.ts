import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

@Module({
  imports: [CoursesModule, UsersModule],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
