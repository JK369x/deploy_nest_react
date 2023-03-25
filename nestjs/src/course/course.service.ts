import { collection_score, collection_account, db } from './../database/firebase/firebase_config';
import { getDoc, query } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { async } from '@firebase/util';
import { Quiz } from '@mui/icons-material';
import { getDocs } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { Injectable, InternalServerErrorException, HttpException, Param, UnauthorizedException } from '@nestjs/common';
import { AddCourseDTO } from './dto/course_data.dto';
import { collection_course, collection_category } from 'src/database/firebase/firebase_config';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ResultOption } from 'Guards/jwtInterface';
import { CategoryService } from 'src/category/category.service';
import * as moment from 'moment';


@Injectable()
export class CourseService {
    constructor(private userService: UserService, private jwtService: JwtService,) { }
    async FindAllCourse() {
        const findAllCourse = await collection_course.orderBy("createDate", "desc").get()
        const data = findAllCourse.docs.map((item, index) => {
            return { ...item.data(), id_document: item.id, }
        })
        if (data) {
            return data
        } else {
            throw new InternalServerErrorException({ message: 'not found all user' })
        }
    }

    async GetallJoinCourse() {
        // const querySnapshot = await db.collectionGroup('Join').get()
        // const joinCourses = [];
        // querySnapshot.forEach((doc) => {
        //     joinCourses.push({
        //         id: doc.id,
        //         data: doc.data(),
        //     });
        // });
        // return joinCourses.length
        console.log('test')
        const courseSnapshot = await collection_course.get();
        const joinCourses = [];
        for (const courseDoc of courseSnapshot.docs) {
            const joinSnapshot = await courseDoc.ref.collection('Join').get();
            joinSnapshot.forEach((joinDoc) => {
                joinCourses.push({
                    id: joinDoc.id,
                    data: joinDoc.data(),
                    courseId: courseDoc.id,
                    startLearn: courseDoc.data().start_learn
                });
            });
        }
        return joinCourses;
    }




    async DeleteCourse(id: string) {
        console.log("success delete course!!", id)
        return await collection_course.doc(id).delete();
    }

    async GetDetailCourse(id: string) {
        const category = await collection_course.doc(id).get()
        return { ...category.data(), id: category.id }
    }

    async EditCourse(id: string, course: any) {
        console.log("course update :", course)
        return await collection_course.doc(id).update({
            ...course,
            updateDate: new Date(),
        });
    }


    async EditQuiz(id: string, id_quiz: string, quiz: any) {
        try {
            console.log("course update :", quiz)
            return await collection_course.doc(id).collection("Quiz").doc(id_quiz).update({
                ...quiz,
                updateDate: moment(),
            });
        } catch (err) {
            console.log("🚀 ~ file: course.service.ts:92 ~ CourseService ~ EditQuiz ~ err:", err)
            return err
        }
    }

    async UpdateApproval(id: string) {
        return await collection_course.doc(id).update({
            approval: true
        });
    }

    async UpdateCheckName(id: string, status: any) {
        console.log("update status", status)
        await collection_course.doc(id).update({
            btn_check_name: status
        });
        return status
    }

    async UpdateComment(id: string, status: any) {
        console.log("update status", status)
        await collection_course.doc(id).update({
            btn_comment: status
        });
        return status
    }
    async addCourse(addcourse: any, user: any) {
        console.log("🚀 ~ file: course.service.ts:61 ~ CourseService ~ addCourse ~ user", user.image_rul)

        try {
            const result = await collection_course.add({
                ...addcourse,
                approval: false,
                pricing: Number(addcourse.pricing),
                create_byName: user.display_name,
                create_status: user.status,
                createDate: new Date(),
                updateDate: new Date(),
                btn_quiz: false,
                btn_check_name: false,
                btn_comment: false,
                image_create: user.image_rul,
                create_by_id: user.id_document,
            })
            if (result) {
                console.log("🚀 add course success id = ", result.id)
            } else {
                console.log('register fail!!')
            }
            return result
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async ApprovalLists() {
        const data_approval = await collection_course.where("approval", "==", false).get()
        const new_data = data_approval.docs.map((item: any) => {
            return { ...item.data(), id_document: item.id }
        })
        return new_data
    }


    async JoinCourse(cookie: any, course_id: string, allcourse: any) {
        console.log(" course id = ", course_id)
        const course = allcourse.find((item: any) => {
            return item.id_document === course_id
        })
        const courseJd_StartLearn = moment(course.start_learn)
        console.log(courseJd_StartLearn)
        const courseJd_endLearn = moment(course.end_learn)
        console.log(courseJd_endLearn)
        const user = this.jwtService.verify<any>(cookie)
        const course_join = await collection_account.doc(user.payload.id_document).collection("Join").orderBy("joinDate", 'asc').get()
        const find_course_join = course_join.docs.map((item: any, index: number) => {
            return allcourse.find((time: any, index: number) => {
                if (item.data().course_id === time.id_document) {
                    console.log(moment(time.start_learn));
                    if (moment(time.start_learn).isBetween(courseJd_StartLearn, courseJd_endLearn)) {
                        console.log('true');
                        return { ...time };
                    }
                }
            })
        }).filter(item => item !== undefined);
        console.log(find_course_join)
        if (find_course_join.length > 0) {
            console.log(`Can't Join Course !!`)
            throw new UnauthorizedException(`ช่วงเวลาในการเรียนตรงกับอีกคอร์ส ชื่อ:${find_course_join[0].title} เริ่มเรียน:${moment(find_course_join[0].start_learn).format('DD/MM/YYYY')} สิ้นสุด:${moment(find_course_join[0].end_learn).format('DD/MM/YYYY')}`)
        } else {
            console.log('Can Join Course')
            try {
                await collection_course.doc(course_id).collection("Join").add({
                    id_user: user.payload.id_document,
                    email_user: user.payload.email,
                    approval: false,
                    name_join: user.payload.display_name,
                    courseName: course.title,
                    image_course: course.image,
                    pricing: Number(course.pricing),
                    category_title: course.category.label,
                    category_id: course.category.id,
                    transaction: false,
                    image_user: user.payload.image_rul ? user.payload.image_rul : '',
                    joinDate: new Date()
                })
                await collection_account.doc(user.payload.id_document).collection("Join").add({
                    id_user: user.payload.id_document,
                    course_id: course_id,
                    email_user: user.payload.email,
                    approval: false,
                    name_join: user.payload.display_name,
                    courseName: course.title,
                    image_course: course.image,
                    pricing: Number(course.pricing),
                    category_title: course.category.label,
                    category_id: course.category.id,
                    transaction: false,
                    image_user: user.payload.image_rul ? user.payload.image_rul : '',
                    joinDate: new Date()
                })
                return true

            } catch (err) {
                console.log("🚀 ~ file: course.service.ts:84 ~ CourseService ~ JoinCourse ~ err", err)
            }
        }
    }



    async OutCourse(cookie: any, outcourse: string) {
        console.log("🚀 outcourse", outcourse)
        const user = this.jwtService.verify<any>(cookie)
        const ref_user = await collection_account.doc(user.payload.id_document).collection("Join").where("course_id", "==", outcourse).get()
        const new_user = ref_user.docs.map((item: any) => {
            return { ...item.data(), join_course: item.id }
        })
        const id_join_user = new_user.map((params: any) => {
            return params.join_course
        })



        const ref_course = await collection_course.doc(outcourse).collection("Join").where("id_user", "==", user.payload.id_document).get()
        const new_data = ref_course.docs.map((item: any) => {
            return { ...item.data(), join_course: item.id }
        })
        const id_join_course = new_data.map((params: any) => {
            return params.join_course
        })

        try {
            await collection_course.doc(outcourse).collection("Join").doc(id_join_course[0]).delete()
            await collection_account.doc(user.payload.id_document).collection("Join").doc(id_join_user[0]).delete()
            return true

        } catch (err) {
            console.log("🚀 ~ file: course.service.ts:84 ~ CourseService ~ JoinCourse ~ err", err)
        }
    }


    async GetAlljoinCourse(id_course: string) {
        const ref_course = await collection_course.doc(id_course).collection("Join").where("approval", "==", false).get()
        const newdata = ref_course.docs.map((item) => {
            return { ...item.data(), join_course: item.id }
        })
        return newdata
    }

    async UpdateImageReceipt(course_id: string, id_user: string, image: any, date_transaction: any) {
        try {
            const ref_user = await collection_account.doc(id_user).collection("Join").where("course_id", "==", course_id).get()
            const id_joinuser = ref_user.docs.map((item: any) => {
                return item.id
            })

            await collection_account.doc(id_user).collection("Join").doc(id_joinuser[0]).update({
                image,
                date_transaction
            })


            const ref_course = await collection_course.doc(course_id).collection("Join").where("id_user", "==", id_user).get()
            const id_join = ref_course.docs.map((item) => {
                return { id_join_course: item.id }
            })
            const newdata = id_join[0].id_join_course
            await collection_course.doc(course_id).collection("Join").doc(newdata).update({
                image,
                date_transaction
            })
            return true
        } catch (err) {
            console.log("🚀 ~ file: course.service.ts:84 ~ CourseService ~ JoinCourse ~ err", err)
        }
    }

    async GetCheckNameBtn(id_course: string) {
        console.log("🚀 ~ file: course.service.ts:153 ~ CourseService ~ GetCheckNameBtn ~ id_course", id_course)
        const ref_course = await collection_course.doc(id_course).get()
        const newdata = await ref_course.data().btn_check_name
        return newdata
    }

    async GetCheckCommentBtn(id_course: string) {
        console.log("🚀 ~ file: course.service.ts:153 ~ CourseService ~ GetCheckNameBtn ~ id_course", id_course)
        const ref_course = await collection_course.doc(id_course).get()
        const newdata = await ref_course.data().btn_comment
        return newdata
    }

    async GetallComment(id_course: string) {
        console.log("🚀 ~ file: course.service.ts:153 ~ CourseService ~ GetCheckNameBtn ~ id_course", id_course)
        const ref_course = await collection_course.doc(id_course).collection("Comment").get()
        const data = ref_course.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
        return data
    }

    async GetStatusBtnCheckName(id_course: string) {
        const ref_course = await collection_course.doc(id_course).collection("Join").where("approval", "==", true).get()
        const newdata = ref_course.docs.map((item) => {
            return { ...item.data(), join_course: item.id }
        })
        return newdata
    }
    async UpdateApprovalJoinCourse(id_course: string, id_document: string) {
        try {
            const ref_idUser = await collection_course.doc(id_course).collection("Join").doc(id_document).get()
            const data_idUser = ref_idUser.data().id_user
            const ref_iddocuser = await collection_account.doc(data_idUser).collection("Join").where('course_id', '==', id_course).get()
            const id_doc_user = ref_iddocuser.docs.map((item: any, index) => {
                return item.id
            })
            const real_doc = id_doc_user[0]

            await collection_account.doc(data_idUser).collection("Join").doc(real_doc).update({
                approval: true,
                transaction: true,
            });
            await collection_course.doc(id_course).collection("Join").doc(id_document).update({
                approval: true,
                transaction: true,
            });
            return true

        } catch (err) {
            console.log("🚀 ~ file: course.service.ts:256 ~ CourseService ~ UpdateApprovalJoinCourse ~ err:", err)

        }
    }
    async DeleteJoinCourse(id_course: string, id_document: string) {
        const ref_idUser = await collection_course.doc(id_course).collection("Join").doc(id_document).get()
        const data_idUser = ref_idUser.data().id_user
        const ref_iddocuser = await collection_account.doc(data_idUser).collection("Join").where('course_id', '==', id_course).get()
        const id_doc_user = ref_iddocuser.docs.map((item: any, index) => {
            return item.id
        })
        const real_doc = id_doc_user[0]
        await collection_account.doc(data_idUser).collection("Join").doc(real_doc).delete();
        await collection_course.doc(id_course).collection("Join").doc(id_document).delete();
        return true
    }
    async DeleteComment(id_course: string, id_comment: string) {
        console.log('id course :', id_course)
        console.log('id comment :', id_comment)
        return await collection_course.doc(id_course).collection("Comment").doc(id_comment).delete()
    }
    async DeleteScoreQuiz(id_user: string, id_comment: string) {
        console.log('id user :', id_user)
        console.log('id  quiz:', id_comment)
        return await collection_account.doc(id_user).collection("score").doc(id_comment).delete()
    }

    async DeleteCheckName(id_course: string, id_checkName: string) {
        return await collection_course.doc(id_course).collection("CheckName").doc(id_checkName).delete()
    }

    //! create check name for mobile 1 more
    async CheckName(id_course: string, user: any) {
        console.log("🚀 ~ file: course.service.ts:305 ~ CourseService ~ CheckName ~ user:", user)
        console.log("first time check name", id_course)
        const data = await collection_course.doc(id_course).collection("CheckName").where('id_user', '==', user.payload.id_document).get()
        console.log('data = ', data.docs.length)
        if (data.docs.length === 0) {
            console.log('check name success !!')
            return await collection_course.doc(id_course).collection("CheckName").add({
                name: user.payload.display_name,
                status: user.payload.status,
                id_user: user.payload.id_document,
                email: user.payload.email,
                date_check_name: new Date()
            })
        } else {
            const newdata = data.docs.map((item: any) => {
                return { ...item.data(), id_document: item.id }
            })
            const day = newdata?.map((day: any) => {
                const old_check = moment(moment(day.date_check_name).format('YYYY-MM-DD'))
                console.log("c", old_check)
                const date = moment()
                const date_now = moment(moment(date).format('YYYY-MM-DD'))
                console.log("d", date_now)
                if (moment(old_check).isSame(moment(date_now))) {
                    console.log('data same!!', date_now)
                    throw new UnauthorizedException(`วันนี้คุณเช็คชื่อไปแล้ว`)
                } else {
                    console.log('=====check name!!======')
                    collection_course.doc(id_course).collection("CheckName").add({
                        name: user.payload.display_name,
                        status: user.payload.status,
                        id_user: user.payload.id_document,
                        date_check_name: new Date()
                    })
                    return true
                }

            })
            return day
        }
    }

    //!create comment course for mobile
    async CommentCourse(id_course: string, user: any, comment_course: any) {
        console.log("comment_course", comment_course)
        console.log("first time comment", id_course)
        const data = await collection_course.doc(id_course).collection("Comment").where('id_user', '==', user.payload.id_document).get()
        console.log('data = ', data.docs.length)
        if (data.docs.length === 0) {
            console.log('create comment !!')
            return await collection_course.doc(id_course).collection("Comment").add({
                ...comment_course,
                id_user: user.payload.id_document
            })
        } else {
            throw new UnauthorizedException()
        }
    }

    async GetCommentById(id_course: string, id_comment: string) {
        const data = await collection_course.doc(id_course).collection("Comment").doc(id_comment).get()
        return { ...data.data(), id_document: data.id }
    }

    async CreateQuiz(id_course: string, quiz: any) {
        console.log("Quiz :", quiz)
        collection_course.doc(id_course).collection("Quiz").add({
            quiz,
            status_quiz: "false",
            title: quiz.newdata,
            createDateTime: new Date().toLocaleDateString()
        })
        return true
    }

    async ReplyComment(id_course: string, id_comment: string, reply: any) {
        await collection_course.doc(id_course).collection("Comment").doc(id_comment).update({
            ...reply,
            status_reply: 'true'

        })
        return true
    }


    async DeleteQuiz(id_course: string, id_document: string) {
        collection_course.doc(id_course).collection("Quiz").doc(id_document).delete()
        console.log("Delete Quiz Id !! :", id_document)
        console.log("From Course Id !! :", id_course)
        return true
    }

    async GetDetailQuiz(id_course: string, id_quiz: string) {
        console.log('Get Detail Quiz....')
        try {
            const getquiz = await collection_course.doc(id_course).collection("Quiz").doc(id_quiz).get()
            console.log("getquiz", getquiz.data())
            return { ...getquiz.data(), id: getquiz.id }

        } catch (err) {
            console.log("🚀 ~ file: course.service.ts:249 ~ CourseService ~ GetDetailQuiz ~ err", err)
        }
    }


    async GetAllQuiz(id_course: string) {
        const data = await collection_course.doc(id_course).collection("Quiz").orderBy("createDateTime", "asc").get()
        const findAllQuiz = data.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
        return findAllQuiz
    }

    async getStatusQuizBtn(id_course: string, id_quiz: string) {
        console.log("🚀 ~ file: course.service.ts:153 ~ CourseService ~ GetCheckNameBtn ~ id_course", id_course)
        const ref_course = await collection_course.doc(id_course).collection("Quiz").doc(id_quiz).get()
        console.log("🚀 ~ file: course.service.ts:264 ~ CourseService ~ getStatusQuizBtn ~ ref_course", ref_course)
        const newdata = await ref_course.data().status_quiz
        return newdata
    }
    async UpdateStatusQuiz(id_course: string, id_quiz: string, status: boolean) {
        console.log("🚀UpdateStatusQuiz ~ status", status)
        return await collection_course.doc(id_course).collection("Quiz").doc(id_quiz).update({
            status_quiz: status
        })
    }
    async UpdateReject(id_course: string, detail: string) {
        return await collection_course.doc(id_course).update({
            reject: detail,
        });
    }

    async GetAllNameCheck(id_course: string) {
        console.log("🚀 ~ file: course.service.ts:346 ~ CourseService ~ GetAllNameCheck ~ id_course", id_course)
        const data = await collection_course.doc(id_course).collection("CheckName").orderBy("date_check_name", "asc").get()
        const findAllNameCheck = data.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
        return findAllNameCheck
    }

    async GetCourseByID(id_user: string) {
        console.log("🚀 ~ file: course.service.ts:282 ~ CourseService ~ GetCourseByID ~ id_user", id_user)
        const data = await collection_course.where('create_by_id', '==', id_user).get()
        console.log("🚀 ~ file: course.service.ts:284 ~ CourseService ~ GetCourseByID ~ data", data.docs)

        const newdata = data.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
        return newdata
    }

    async GetCheckNameById(id_course: string, id_user: string) {
        const data = await collection_course.doc(id_course).collection("CheckName").where('id_user', '==', id_user).get()
        const findAllNameCheck = data.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
        return findAllNameCheck
    }
    async AddScoreQuiz(id_user: string, params: any) {
        const data = await collection_account.doc(id_user).collection("score").add({
            ...params,
            createDate: new Date(),
        })
        return data
    }
    async GetAllScoreQuizById(id_user: string, id_course: string) {
        const data = await collection_account.doc(id_user).collection("score").where('id_course', '==', id_course).get()
        return data.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
    }

    async UserJoinCourseFormCateGory(category: any) {
        const coursesRef = collection_course
        const coursesSnapshot = await coursesRef.get();

        const allJoinDetails = [];

        for (const courseDoc of coursesSnapshot.docs) {
            const joinRef = courseDoc.ref.collection('Join');
            const joinSnapshot = await joinRef.get();
            const joinDetails = joinSnapshot.docs.map((doc) => ({ courseId: courseDoc.id, joinId: doc.id, data: doc.data() }));
            allJoinDetails.push(...joinDetails);
        }
        // const Category_title = category.map((item: any) => { return item.Category_Title })
        // const ref_course = await collection_course.get()
        // const filter_course = ref_course.docs.filter((item: any, index: number) => {
        //     const data = Category_title.map((title: any) => {
        //         if (item.data().category.label === title) {
        //             return { category: item.data() }
        //         } else {
        //             console.log('title not match')
        //         }
        //     })
        //     return data
        // })
        // const data = await collection_account.doc(id_user).collection("score").where('id_course', '==', id_course).get()

        return allJoinDetails
    }


}
