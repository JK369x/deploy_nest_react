import { CourseModule } from './../course/course.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthMiddleWare } from 'src/middleware/authmiddleware';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local/local.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    UserModule, PassportModule, CourseModule],

  providers: [AuthService, LocalStrategy, UserService],
  controllers: [AuthController],
})

export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //!เรียกใช้ class
    consumer.apply(AuthMiddleWare)
      //!use middleware all controller if not have token don't go middleware exclude

      .exclude({
        path: "auth/signin", method: RequestMethod.POST,
        //? check controller  now check AuthController
      },
        { path: 'auth/register', method: RequestMethod.POST },).forRoutes(AuthController)
  }
}
