import { collection_verifyemail, collection_account } from './../database/firebase/firebase_config';


import { User, UserService } from './user.service';
import { Body, Controller, Get, Post, Headers, Request, Req, HttpStatus, HttpException, UseGuards, Delete, Param, Put, UnauthorizedException, Res } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import AuthGuard from 'Guards/AuthGuard';
import { Response } from 'express';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

import { MailerService } from '@nestjs-modules/mailer';
import * as moment from 'moment';
@Controller('user')
export class UserController {
    constructor(private userService: UserService, private courseServiec: CourseService, private mailService: MailerService) { }


    // @Cron(CronExpression.EVERY_30_SECONDS)
    @Cron(CronExpression.EVERY_DAY_AT_6PM)
    async sendCourseNotification() {
        const data = await this.courseServiec.GetallJoinCourse()
        const approlval = data.filter((item: any) => item.data.approval === true)
        console.log("🚀 ~ file: user.controller.ts:44 ~ UserController ~ GetallJoin ~ approlval:", approlval)
        const oneDayBeforeCourseStartDate = moment().add(1, 'days').toDate();
        const dayIsSame = approlval.map((item: any) => {
            if (moment(oneDayBeforeCourseStartDate).date() == moment(item.startLearn).date()) {
                console.log('day  !!', moment(oneDayBeforeCourseStartDate).date(), moment(item.startLearn).date())
                return { ...item, joinDateMoment: moment(item.startLearn) }
            }
        }).filter((item: any) => item != null)
        for (const joinDoc of dayIsSame) {
            await this.mailService.sendMail({
                to: joinDoc.data.email_user,
                from: 'rmuttlearn0612@gmail.com',
                subject: `Reminder: Your course ${joinDoc.data.courseName} starts tomorrow`,
                text: `Your course ${joinDoc.data.courseName} starts on ${moment(joinDoc.startLearn).format('DD-MM-YYYY H:mm')}. Don't forget to attend!`,
            })
        }
        return approlval
    }

    @Get('alluser')
    async GetAllUser(): Promise<any> {
        console.log('get all use')
        return await this.userService.findAllUser()
    }

    @Get('getalljoincourseallcourse')
    async GetallJoin() {
        const data = await this.courseServiec.GetallJoinCourse()
        return data
    }

    @Get('findoneuser')
    async GetOneUser(@Body() email: string): Promise<any> {
        return await this.userService.findOneUser(email)
    }
    @Get('allteacher')
    async GetAllTeacher(): Promise<any> {
        return await this.userService.findAllTeacher()
    }

    @Post('register')
    async Register(@Body() data: any): Promise<User> {
        const email = data.email
        const status = data.status.id
        console.log("🚀 ~ file: user.controller.ts:34 ~ UserController ~ Register ~ status:", status)
        const verificationToken = Math.random().toString(36).substring(7);
        console.table(verificationToken)
        try {
            if (status === '10' || status === '4') {
                await this.mailService.sendMail({
                    to: email,
                    from: 'rmuttlearn0612@gmail.com',
                    subject: ' verify your email',
                    text: `Hello, please click on this link to verify your email address: http://141.98.17.47:8000/user/verifyemployee/${verificationToken}`,
                })

                const data_register = await this.userService.Register(data, verificationToken)
                return data_register
            } else {
                await this.mailService.sendMail({
                    to: email,
                    from: 'rmuttlearn0612@gmail.com',
                    subject: ' verify your email',
                    text: `Hello, please click on this link to verify your email address: http://141.98.17.47:8000/user/verify/${verificationToken}`,
                })

                const data_register = await this.userService.Register(data, verificationToken)
                return data_register
            }

        } catch (err) {
            console.log(err);
            return false
        }
    }
    @Get('verify/:verificationToken')
    async verifyUserEmail(@Param('verificationToken') verificationToken: string, @Res() res: Response) {
        // Check if the verification token exists in the database
        const user = await collection_account.where('verificationToken', '==', verificationToken).get()
        console.table(user.docs)
        const user_data = user.docs
        if (user.docs.length > 0) {
            const data = user_data.map((item: any) => {
                return item.id
            })
            await collection_account.doc(data[0]).update({
                verify_email: true
            })
            return res.redirect('http://141.98.17.47/loginsuccess');
        } else {
            console.log('not found user')
            return false
        }
    }

    @Get('verifyemployee/:verificationToken')
    async verifyEmployeeEmail(@Param('verificationToken') verificationToken: string, @Res() res: Response) {
        // Check if the verification token exists in the database
        const user = await collection_account.where('verificationToken', '==', verificationToken).get()
        console.table(user.docs)
        const user_data = user.docs
        if (user.docs.length > 0) {
            const data = user_data.map((item: any) => {
                return item.id
            })
            await collection_account.doc(data[0]).update({
                verify_email: true
            })
            return res.redirect('http://141.98.17.47/adminlogin');
        } else {
            console.log('not found user')
            return false
        }
    }

    @Post('register_mobile')
    async RegisterMobile(@Body() data: any): Promise<User> {
        const email = data.email
        console.table(email)
        const verificationToken = Math.random().toString(36).substring(7);
        console.table(verificationToken)
        try {
            await this.mailService.sendMail({
                to: email,
                from: 'rmuttlearn0612@gmail.com',
                subject: 'test',
                text: `Hello, please click on this link to verify your email address: http://localhost:8000/user/verify/${verificationToken}`,
            })
            const data_register = await this.userService.RegisterMobile(data, verificationToken)
            return data_register
        } catch (err) {
            console.log(err);
            return false
        }
    }

    @Delete('deleteuser/:id')
    async DeleteUser(@Param('id') id: string) {
        console.log("delete user success !!")
        await this.userService.DeleteUser(id);
    }

    @Put('updateuser/:id')
    async UpdateUser(@Param('id') id: string, @Body() userDto: any) {
        console.log("update user success !!")
        return await this.userService.updateUser(id, userDto);
    }

    @Get('getdetailuser/:id')
    async GetDetailUser(@Param('id') id: string) {
        return await this.userService.GetDetailUser(id)
    }

    @Get('getuser')
    async Getuser() {
        return await this.userService.getUser()
    }

    @Get('getfavoritefromid/:id')
    async GetFavoriteAll(@Param('id') id: string) {
        const get_all_course = await this.courseServiec.FindAllCourse()
        return await this.userService.GetFavorite(id, get_all_course)

    }
    @Put('addfavorite/:id')
    async AddFavorite(@Param('id') id: string, @Body() Course: any) {
        return await this.userService.AddFavorite(id, Course)
    }

    @Get('getjoincoursefromid/:id')
    async GetJoinCourseAll(@Param('id') id: string) {
        const get_all_course = await this.courseServiec.FindAllCourse()
        return await this.userService.GetCourse(id, get_all_course)

    }
    @Put('addjoincourse/:id')
    async AddJoinCourse(@Param('id') id: string, @Body() Course: any) {
        return await this.userService.AddCourse(id, Course)
    }


    @Put('updatepassword/:id')
    async UpdatePassword(@Param('id') id: string, @Body() password: string) {
        console.log('password = ', password)
        return await this.userService.UpdatePassword(id, password)
    }

    @Get('getjoincoursebyIduser/:id_user')
    async GetJoinCourseByIdUser(@Param('id_user') id_user: string) {
        const data_join = await this.userService.GetAllJoinCourseByIdUser(id_user)
        return data_join
    }

    @Get('getdetailtransaction/:id_user/:id_document')
    async GetDetailTransaction(@Param('id_user') id_user: string, @Param('id_document') id_document: string) {
        const data_join = await this.userService.GetDetailReceipt(id_user, id_document)
        return data_join
    }

    @Get('createcertificate/:id_user')
    async GetCertificate(@Param('id_user') id_user: string) {
        const score = await this.userService.Certificate(id_user)
        return score
    }

    @Post('gentokencertificate/:id_user')
    async GenTokenCertificate(@Param('id_user') id_user: string, @Body() certificate: any) {
        console.log(certificate)
        const score = await this.userService.GenToKenCertificate(id_user, certificate)
        return score
    }

    @Get('getapprovaluserforcheckjoincourse/:id_user/:id_course')
    async GetUserApprovalInCourse(@Param('id_user') id_user: string, @Param('id_course') id_course: string) {
        const result = await this.userService.GetApprovalUserById(id_user, id_course)
        return result
    }


    @Get('verifycertificateuser/:id_user/:id_course/:token')
    async VerifyCertificateUser(@Param('id_user') id_user: string, @Param('id_course') id_course: string, @Param('token') token: string) {
        console.log(token, id_user, id_course)
        const result = await this.userService.VerifyCertificateUser(id_user, id_course, token)
        return result
    }
}


