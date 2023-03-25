import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { UserService } from './user/user.service';
import { CourseService } from './course/course.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CourseController } from './course/course.controller';
import { UploadModule } from './upload/upload.module';
import { ProviceModule } from './provice/provice.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';




@Global()
@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({ secret: 'secretKey' }), UserModule, PassportModule, AuthModule, CategoryModule, CourseModule, UploadModule, ProviceModule
    , MailerModule.forRoot({

      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          // pass: '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'
          pass: process.env.SEND_GRID_KEY,
        }
      }
    }),
  ],

  providers: [UserService, CourseService],
  exports: [JwtModule, PassportModule, MailerModule]

})
export class AppModule { }
