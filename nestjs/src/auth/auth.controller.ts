import { CourseService } from 'src/course/course.service';
import { Body, Controller, Get, Post, Headers, Response, Request, Req, HttpStatus, HttpException, UseGuards, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDataDto } from './dto/signin_data_dto';
import { Request as RequestType, Response as ResponseType } from 'express'
import { LocalAuthGuard } from './local/local-auth.guards';
import AuthGuard from 'Guards/AuthGuard';

import { UserService } from 'src/user/user.service';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService, private courseService: CourseService) { }

    @UseGuards(AuthGuard)
    @Get('me')
    async AuthMe(@Response() res: ResponseType, @Request() req: RequestType) {
        console.log("======================== Me =============================")
        const cookieAccess = req.cookies.access_token
        const user = await this.userService.getUser()
        const data_new = await this.authService.AutoSignIn(user)
        return res.send({ user, data_new })
    }

    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async SignIn(@Body() signinData: SignInDataDto, @Response() res: ResponseType, @Request() req: RequestType): Promise<any> {
        try {
            console.log('login')
            const data = await this.authService.SignIn(signinData);
            res.cookie('access_token', data.token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            })
            const user = await this.userService.getUser()
            delete data.token
            return res.send({ data, user })
            // if (data.verify_email === true) {
            //     res.cookie('access_token', data.token, {
            //         httpOnly: true,
            //         sameSite: 'none',
            //         secure: true,
            //     })
            //     const user = await this.userService.getUser()
            //     delete data.token
            //     return res.send({ data, user })
            // } else {
            //     throw new HttpException('Unauthorize', HttpStatus.BAD_REQUEST);
            // }
        } catch (error) {
            console.log("🚀 ~ file: auth.controller.ts:31 ~ AuthController ~ SignIn ~ error", error)
            throw new HttpException('Unauthorize', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('signinmobile')
    async SignInMobile(@Body() signinData: SignInDataDto, @Response() res: ResponseType, @Request() req: RequestType): Promise<any> {
        try {
            const data = await this.authService.SignInMobile(signinData);
            const user = await this.userService.getUser()

            return res.send({ data, user })
            // if (data.verify_email === true) {
            //     res.cookie('access_token', data.token, {
            //         httpOnly: true,
            //         sameSite: 'none',
            //         secure: true,
            //     })
            //     const user = await this.userService.getUser()
            //     delete data.token
            //     return res.send({ data, user })
            // } else {
            //     throw new HttpException('Unauthorize', HttpStatus.BAD_REQUEST);
            // }
        } catch (error) {
            console.log("🚀 ~ file: auth.controller.ts:31 ~ AuthController ~ SignIn ~ error", error)
            throw new HttpException('Unauthorize', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Get('signout')
    SignOut(@Response() res: ResponseType, @Request() req: RequestType) {
        console.log('logout !!')
        res.cookie('access_token', '', {
            httpOnly: true,
        })

        return res.send()
    }




}
