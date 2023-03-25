import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from 'src/user/user.controller';
import { CategoryService } from 'src/category/category.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [UserModule, PassportModule, CategoryModule],
  providers: [CourseService, UserService, CategoryService],
  controllers: [CourseController],
  exports: [CourseService]
})
export class CourseModule { }
