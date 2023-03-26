import { CategoryService } from './../category/category.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { AddCourseDTO } from './dto/course_data.dto';
import { UserService } from 'src/user/user.service';
import AuthGuard from 'Guards/AuthGuard';
import { Request as RequestType, Response as ResponseType } from 'express'
import { Headers, Response, Request, Req, HttpStatus, HttpException, Inject } from '@nestjs/common';
@Controller('course')
export class CourseController {
    constructor(private courseService: CourseService, private userService: UserService, private categoryService: CategoryService) { }

    //!Post
    @UseGuards(AuthGuard)
    @Post('addcourse')
    async AddCourse(@Body() addcourse: AddCourseDTO) {
        console.log('created....')
        console.log('test')
        const user = await this.userService.getUser()
        return await this.courseService.addCourse(addcourse, user.payload)
    }
    @Post('joincourse/:id')
    async JoinCourse(@Param('id') id: string, @Request() req: RequestType) {
        console.log("🚀 ~ file: course.controller.ts:53 ~ CourseController ~ JoinCourse ~ courseName", id)
        console.log('meet')
        const cookieAccess = req.cookies.access_token
        const allcourse = await this.courseService.FindAllCourse()
        const data = await this.courseService.JoinCourse(cookieAccess, id, allcourse)
        // console.log("join course!!", data)
        return data
    }
    @Post('outjoincourse/:id')
    async OutCourse(@Request() req: RequestType, @Param('id') id: string) {
        const cookieAccess = req.cookies.access_token
        const data = await this.courseService.OutCourse(cookieAccess, id)
        console.log("out course!!", data)
        return data
    }
    @UseGuards(AuthGuard)
    @Post('checknamejoincourse/:id')
    async CheckNameJoinCurse(@Param('id') id: string) {
        const user = await this.userService.getUser()
        console.log("checked Name !!")
        const data = await this.courseService.CheckName(id, user)
        return data

    }
    @UseGuards(AuthGuard)
    @Post('commentcourse/:id')
    async CommentCourse(@Param('id') id: string, @Body() comment_course: any) {
        const user = await this.userService.getUser()
        console.log("Comment Process !!")
        return await this.courseService.CommentCourse(id, user, comment_course)
    }

    @Post('createquiz/:id')
    async CreateQuiz(@Param('id') id: string, @Body() quiz: any) {
        console.log("🚀 ~ file: course.controller.ts:120 ~ CourseController ~ CreateQuiz ~ quiz", quiz)
        return await this.courseService.CreateQuiz(id, quiz)
    }
    @Post('createscorequiz/:id_user')
    async CreateScoreQuiz(@Param('id_user') id_user: string, @Body() score: any) {
        console.log("🚀 ~ file: course.controller.ts:58 ~ CourseController ~ CreateScoreQuiz ~ score", score)
        return await this.courseService.AddScoreQuiz(id_user, score)
    }

    //*get 
    @Get('getallcourse')
    async GetAllCourse() {

        return await this.courseService.FindAllCourse()
    }
    @Get('getapprovalfalse')
    async GetApprovalFalse() {
        const data = await this.courseService.ApprovalLists()
        console.log("approval = false ❌", data)
        return data
    }
    @Get('getdetailcourse/:id')
    async GetDetailCourse(@Param('id') id: string) {
        return await this.courseService.GetDetailCourse(id)
    }
    @Get('getalljoincourse/:id')
    async GetallJoinCourse(@Param('id') id: string) {
        const data = await this.courseService.GetAlljoinCourse(id)
        console.log("get course!!", data)
        return data
    }
    @Get('getalljoincoursetrue/:id')
    async GetallJoinCourseArrpoval(@Param('id') id: string) {
        const data = await this.courseService.GetStatusBtnCheckName(id)
        console.log("get course!!", data)
        return data
    }
    @Get('checknamebtn/:id')
    async CheckName(@Param('id') id_course: string) {
        console.log("🚀 ~ file: course.controller.ts:79 ~ CourseController ~ CheckName ~ id_course", id_course)
        const data = await this.courseService.GetCheckNameBtn(id_course)
        console.log("get course!!", data)
        return data
    }
    @Get('btncomment/:id')
    async CommentBtn(@Param('id') id_course: string) {
        console.log(" id_course", id_course)
        const data = await this.courseService.GetCheckCommentBtn(id_course)
        console.log("get comment!!", data)
        return data
    }
    @Get('getallquiz/:id')
    async GetAllQuiz(@Param('id') id: string) {
        console.log('get all quiz !!')
        return await this.courseService.GetAllQuiz(id)
    }
    @Get('getdetailquiz/:id_course/:id_quiz')
    async GetDetailQuiz(@Param('id_course') id_course: string, @Param('id_quiz') id_quiz: string) {
        console.log('Get Detail quiz !!')
        return await this.courseService.GetDetailQuiz(id_course, id_quiz)
    }
    @Get('getstatusbtnquiz/:id_course/:id_quiz')
    async GetStatusBtnQuiz(@Param('id_course') id_course: string, @Param('id_quiz') id_quiz: string) {
        console.log("🚀 ~ file: course.controller.ts:79 ~ CourseController ~ CheckName ~ id_course", id_course)
        const data = await this.courseService.getStatusQuizBtn(id_course, id_quiz)
        console.log("get course quiz status !!", data)
        return data
    }
    @Get('getcoursebyid/:id')
    async GetCourseByID(@Param('id') id: string) {
        const data = await this.courseService.GetCourseByID(id)
        return data
    }
    @Get('getallcomment/:id')
    async GetAlComment(@Param('id') id: string) {
        const data = await this.courseService.GetallComment(id)
        return data
    }
    @Get('getallnamecheck/:id')
    async GetAllNameCheck(@Param('id') id: string) {
        console.log('get all name check')
        const data = await this.courseService.GetAllNameCheck(id)
        return data
    }
    @Get('getnamecheckbyid/:id_course/:id_user')
    async GetNameCheckById(@Param('id_course') id_course: string, @Param('id_user') id_user: string) {
        console.log('get By Id name check')
        const data = await this.courseService.GetCheckNameById(id_course, id_user)
        return data
    }
    @Get('getscorebyid/:id_user/:id_course')
    async GetScoreQuiz(@Param('id_user') id_user: string, @Param('id_course') id_course: string) {
        console.log("id_user", id_user)
        console.log('get By Id Quiz score ')
        const data = await this.courseService.GetAllScoreQuizById(id_user, id_course)
        return data
    }
    @Get('commentbyid/:id_course/:id_comment')
    async GetCommentById(@Param('id_course') id_course: string, @Param('id_comment') id_comment: string) {
        console.log('get comment detail!!')
        const data = await this.courseService.GetCommentById(id_course, id_comment)
        return data
    }
    @Get('userjoincoursebycategory')
    async GetUserJoinCourseByCategory() {
        const data = await this.categoryService.FindAllCategory()
        const data_join = await this.courseService.UserJoinCourseFormCateGory(data)
        return data_join
    }


    //?Delete
    @Delete('deletecourse/:id')
    async DeleteCourse(@Param('id') id: string) {
        return await this.courseService.DeleteCourse(id)
    }
    @Delete('deletejoincourse/:id/:id_join')
    async DeleteJoinCourse(@Param('id') id_course: string, @Param('id_join') id_join: string) {
        return await this.courseService.DeleteJoinCourse(id_course, id_join)
    }
    @Delete('deletequiz/:id_course/:id_quiz')
    async DeleteQuiz(@Param('id_course') id_course: string, @Param('id_quiz') id_quiz: string) {
        console.log('Controller Delete Quiz !!')
        return await this.courseService.DeleteQuiz(id_course, id_quiz)
    }
    @Delete('deletecomment/:id_course/:id_comment')
    async DeleteComment(@Param('id_course') id_course: string, @Param('id_comment') id_comment: string) {
        console.log('Controller Delete Comment !!')
        return await this.courseService.DeleteComment(id_course, id_comment)
    }
    @Delete('deletecheckname/:id_course/:id_checkName')
    async DeleteCheckName(@Param('id_course') id_course: string, @Param('id_checkName') id_checkName: string) {
        console.log("🚀 ~ file: course.controller.ts:178 ~ CourseController ~ DeleteCheckName ~ id_checkName", id_checkName)
        console.log("🚀 ~ file: course.controller.ts:178 ~ CourseController ~ DeleteCheckName ~ id_course", id_course)
        console.log('Controller Delete check name by ID !!')
        return await this.courseService.DeleteCheckName(id_course, id_checkName)
    }
    @Delete('deletescorequiz/:id_course/:id_comment')
    async DeleteQuizById(@Param('id_course') id_course: string, @Param('id_comment') id_comment: string) {
        console.log('Controller Delete Quiz Score !!')
        return await this.courseService.DeleteScoreQuiz(id_course, id_comment)
    }


    //Put
    @Put('updatecourse/:id')
    async UpdateCourse(@Param('id') id: string, @Body() courseDTO: any) {
        return await this.courseService.EditCourse(id, courseDTO)
    }

    @Put('updatequiz/:id_course/:id_quiz')
    async UpdateQuizPost(@Param('id_course') id_course: string, @Param('id_quiz') id_quiz: string, @Body() params: any) {
        return await this.courseService.EditQuiz(id_course, id_quiz, params)
    }

    @Put('updatebtncheckname/:id/:check')
    async UpdateCheckName(@Param('id') id: string, @Param('check') check: boolean) {
        console.log("🚀 ~ file: course.controller.ts:42 ~ CourseController ~ UpdateCheckName ~ check", check)
        console.log('update btn !!')
        return await this.courseService.UpdateCheckName(id, check)
    }
    @Put('updatecomment/:id/:check')
    async UpdateComment(@Param('id') id: string, @Param('check') check: boolean) {
        console.log("🚀 ~ file: course.controller.ts:42 ~ CourseController ~ UpdateCheckName ~ check", check)
        console.log('update btn !!')
        return await this.courseService.UpdateComment(id, check)
    }
    @Put('updateapproval/:id')
    async UpdateApproval(@Param('id') id: string) {
        return await this.courseService.UpdateApproval(id)
    }
    @Put('updateapprovaljoincourse/:id_course/:id_user')
    async UpdateApprovalJoinCourse(@Param('id_course') id_course: string, @Param('id_user') id_user: string) {
        const data = await this.courseService.UpdateApprovalJoinCourse(id_course, id_user)
        return data
    }
    @Put('rejectupdate/:id')
    async Reject(@Param('id') id: string, @Body() reject: any) {
        console.log('reject update !!', reject)
        return await this.courseService.UpdateReject(id, reject)
    }
    @Put('updatequizstatus/:id_course/:id_quiz/:status')
    async UpdateQuiz(@Param('id_course') id_course: string, @Param('id_quiz') id_quiz: string, @Param('status') status: boolean) {
        console.log("🚀 ~ file: course.controller.ts:139 ~ CourseController ~ UpdateQuiz ~ status", status)
        return await this.courseService.UpdateStatusQuiz(id_course, id_quiz, status)
    }

    @Put('updateimagereceipt/:id_course/:id_user')
    async UpdateImageReceipt(@Param('id_course') id_course: string, @Param('id_user') id_user: string, @Body() Tracnsactopn: any) {
        console.log("🚀 ~ file: course.controller.ts:158 ~ CourseController ~ UpdateImageReceipt ~ Tracnsactopn", Tracnsactopn)
        const image = Tracnsactopn.image_url
        const date_transaction = Tracnsactopn.date
        return await this.courseService.UpdateImageReceipt(id_course, id_user, image, date_transaction)
    }
    @Put('replycomment/:id_course/:id_comment')
    async ReplyComment(@Param('id_course') id_course: string, @Param('id_comment') id_comment: string, @Body() reply: any) {
        console.log("id comment", id_comment)
        console.log("id course", id_course)
        console.log('reply update !!', reply)
        return await this.courseService.ReplyComment(id_course, id_comment, reply)
    }


}
