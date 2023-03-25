import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CourseService } from 'src/course/course.service';
import { CourseModule } from 'src/course/course.module';


@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, CourseService],
  exports: [UserService],
})
export class UserModule {

}
