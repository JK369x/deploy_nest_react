import { async } from '@firebase/util';
import { collection_account, collection_verifyemail, collection_course, } from './../database/firebase/firebase_config';
import { query } from 'firebase/firestore';
import { Injectable, InternalServerErrorException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDataDto } from './dto/register_data_dto';
import * as bcrypt from 'bcrypt'
import * as crypto from "crypto";

export type User = any;

@Injectable()
export class UserService {
    constructor(private jwtSerVice: JwtService,) { }

    public user: any;

    async setUser(user: any) {
        console.log("set user success !!")
        this.user = user;
    }

    async getUser() {
        if (this.user) {
            console.log('get usear success !!')
            return this.user;
        } else {
            console.log('fail get user!!')
            return false
        }
    }

    async findOneUser(email: string): Promise<User | undefined> {
        const user = await collection_account.where('email', '==', email).get()
        if (user.docs.length > 0) {
            return user.docs
        } else {
            return false
        }
    }

    async GetDetailUser(id: string): Promise<User | undefined> {
        const user = await collection_account.doc(id).get()
        console.log("🚀 ~ file: user.service.ts:36 ~ UserService ~ GetDetailUser ~ user", user.data())
        return { ...user.data(), id_document: user.id }
    }

    async findAllUser(): Promise<User | undefined> {
        // const userAll = await collection_account.where("verify_email", '==', true).get()
        const userAll = await collection_account.orderBy("email", "desc").get()
        const data = userAll.docs.map((item, index) => {
            return { ...item.data(), id_document: item.id }
        })
        if (data) {
            return data
        } else {
            throw new InternalServerErrorException({ message: 'not found all user' })
        }
    }

    async findAllTeacher(): Promise<User | undefined> {
        console.log('get teacher')
        const userAll = await collection_account.where('status.id', '==', "4").get()
        const data = userAll.docs.map((item, index) => {
            return { ...item.data(), id_document: item.id }
        })
        if (data) {
            return data
        } else {
            throw new InternalServerErrorException({ message: 'not found all user' })
        }
    }

    async DeleteUser(id: string): Promise<User | undefined> {
        console.log("🚀 ~ file: user.service.ts:58 ~ UserService ~ DeleteUser ~ id", id)
        return await collection_account.doc(id).delete();

    }

    async updateUser(id: string, userDto: any) {
        console.log("user update :", userDto)
        return await collection_account.doc(id).update(userDto);
    }

    async Register(register: RegisterDataDto, verificationToken: any): Promise<User> {
        const email = register.email
        const data = await this.findOneUser(email)
        if (data === false) {
            try {
                let newdata: any = register
                delete newdata.confirmPassword
                const result = await collection_account.add({
                    ...newdata,
                    createDate: new Date(),
                    updateDate: new Date(),
                    verificationToken,
                    verify_email: false,
                })
                return result
            } catch (err) {
                console.log(err)
                return false
            }
        } else {
            const user = data[0].data()
            const id_user = data[0].id
            console.log(user)
            if (user.verify_email === false) {
                console.log("wait email to verify")
                await collection_account.doc(id_user).update({
                    verificationToken,
                })
            } else {
                throw new UnauthorizedException('ชื่อผู้ใช้นั้นมีผู้อื่นใช้แล้ว ลองใช้ชื่ออื่น')
            }
        }
    }
    async RegisterMobile(register: RegisterDataDto, verificationToken: any): Promise<User> {
        const email = register.email
        const data = await this.findOneUser(email)
        if (data === false) {
            const salt = bcrypt.genSaltSync()
            const password = bcrypt.hashSync(register.password, salt)
            try {
                let newdata: any = register
                delete newdata.confirmPassword
                const result = await collection_account.add({
                    ...newdata,
                    salt: salt,
                    password,
                    createDate: new Date(),
                    updateDate: new Date(),
                    verificationToken,
                    verify_email: false,
                })
                return result
            } catch (err) {
                console.log(err)
                return false
            }
        } else {
            const user = data[0].data()
            const id_user = data[0].id
            console.log(user)
            if (user.verify_email === false) {
                console.log("wait email to verify")
                await collection_account.doc(id_user).update({
                    verificationToken,
                })
            } else {
                throw new UnauthorizedException('ชื่อผู้ใช้นั้นมีผู้อื่นใช้แล้ว ลองใช้ชื่ออื่น')
            }
        }
    }
    async verifyEmail(email: string, verifytoken: any): Promise<User> {
        try {
            const result = await collection_verifyemail.add({
                email,
                verifytoken,
                createDate: new Date(),
                updateDate: new Date(),
            })
            return result
        } catch (err) {
            console.log(err)
            throw new UnauthorizedException('กรุณาตรวจสอบอีเมล')
        }



    }
    async UpdatePassword(id: string, password: any) {
        try {
            const salt = password.salt
            const password_salt = password.password_salt
            console.log('update password')
            // return false
            return await collection_account.doc(id).update({
                salt,
                password: password_salt
            })
        } catch (err) {
            console.log("🚀 ~ file: user.service.ts:118 ~ UserService ~ UpdatePassword ~ err:", err)
            throw new UnauthorizedException('test')
        }
    }

    async AddFavorite(id: string, params: string[]): Promise<any> {
        console.log(`add favorite :${params} doc id user:${id}`)
        return await collection_account.doc(id).update({
            favorite: params
        })
    }

    async GetFavorite(id: string, course_favorite: any) {
        console.log("🚀 ~ file: user.service.ts:101 ~ UserService ~ GetFavorite ~ id", id)
        const user = await collection_account.doc(id).get()
        const favorite_firebase = user.data().favorite
        console.log("user favorite course:", favorite_firebase)
        const newdata = course_favorite.filter((item: any) => favorite_firebase?.includes(item.id_document))
        return newdata
    }


    async AddCourse(id: string, params: string[]): Promise<any> {
        console.log(`add favorite :${params} doc id user:${id}`)
        return await collection_account.doc(id).update({
            course_join: params
        })
    }

    async GetCourse(id: string, course_course: any) {
        console.log("get join course id", id)
        const user = await collection_account.doc(id).get()
        const join_course_firebase = user.data().join_course
        console.log("join course ", join_course_firebase)
        const newdata = course_course.filter((item: any) => join_course_firebase?.includes(item.id_document))
        return newdata
    }

    async GenToKenCertificate(id_user: string, certificate: any) {
        try {
            const ref_doc_certificate = await collection_account.doc(id_user).collection("Certificate").where('id_course', '==', certificate.id_course).get()
            const len_certificate = ref_doc_certificate.docs.length
            const Into_Certificate = ref_doc_certificate.docs.map((item: any, index: number) => item.data())
            if (len_certificate > 0) {
                console.log('already have certificate')
                return Into_Certificate[0].token
            } else {
                // Define the certificate details
                const IdCourse: string = certificate.id_course;
                const userID: string = id_user;
                const completionDate: string = certificate.end_learn
                const IdCreate_Course: string = certificate.id_create
                // Concatenate the details into a string
                const certificateDetails: string = IdCourse + userID + completionDate + IdCreate_Course;
                console.table(certificateDetails)
                // Hash the details using SHA-256
                const hashedDetails: string = crypto.createHash("sha256").update(certificateDetails).digest("hex");

                // Generate the token using the hashed details
                const token: string = "VERIFY-" + hashedDetails.slice(0, 8) + "-" + hashedDetails.slice(-8);
                console.log("Token: ", token);

                const data = await collection_account.doc(id_user).collection("Certificate").add({
                    ...certificate,
                    id_user: id_user,
                    token
                })
                return token
            }
        } catch (err) {
            console.log(err)
        }
    }

    async GetAllJoinCourseByIdUser(id_user: string) {
        try {
            const data = await collection_account.doc(id_user).collection("Join").orderBy('joinDate', 'asc').get()
            const newdata = data.docs.map((item: any, index: number) => {
                return { ...item.data(), id_document: item.id }
            })
            return newdata
        } catch (err) {
            throw new UnauthorizedException('Error!! ')
        }
    }

    async GetDetailReceipt(id_user: string, id_comment: string) {
        try {
            const newdata = await collection_account.doc(id_user).collection("Join").doc(id_comment).get()
            return newdata.data()
        } catch (err) {
            console.log(err)
        }
        return
    }

    async GetApprovalUserById(id_user: string, id_course: string) {
        console.log("🚀 ~ file: user.service.ts:250 ~ UserService ~ GetApprovalUserById ~ id_course:", id_course)
        console.log("🚀 ~ file: user.service.ts:250 ~ UserService ~ GetApprovalUserById ~ id_user:", id_user)
        try {
            console.log('Approval User!!')
            const data = await collection_account.doc(id_user).collection("Join").where('course_id', '==', id_course).get()
            const convert_data = data.docs.map((item: any, index: number) => {
                return { approval: item.data().approval, id_document: item.id, transaction: item.data().image, }
            })
            console.table(convert_data)
            return convert_data
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async Certificate(id_user: string) {
        const data = await collection_account.doc(id_user).collection("score").get()
        const score = data.docs.map((item: any, index: number) => {
            return item.data().id_course
        })
        const full_score = data.docs.map((item: any, index: number) => {
            return { id: item.data().id_course, score_full: item.data().full_score, user_score: item.data().total_score }
        })

        // console.table(getData)
        console.table(full_score)
        //? set score unique id 
        const id_course_list = Array.from(new Set(score))
        const result = {};
        const total = {};
        for (const { id, score_full, user_score } of full_score) {
            if (id in result) {
                result[id] += score_full;
                total[id] += user_score;
            } else {
                result[id] = score_full;
                total[id] = user_score;
            }
        }
        // console.log(result)
        // console.log(total)
        const courses = await Promise.all(id_course_list.map(getCourseById));
        console.log("🚀 ~ file: user.service.ts:310 ~ UserService ~ Certificate ~ courses:", courses)
        const finally_result = courses.map((item, index) => {
            console.log('item.id_document:', item.id);
            console.log('result:', result[item.id]);
            return { title: item.title, start_learn: item.start_learn, end_learn: item.end_learn, score_quiz: result[item.id], score_user: total[item.id], create_by: item.create_byName, image_course: item.image, id_create: item.create_by_id, course_category: item.category, id_course: item.id }
        });
        console.table(finally_result);
        return finally_result;

        async function getCourseById(courseId: string) {
            const courseRef = collection_course.doc(courseId);
            const courseDoc = await courseRef.get();
            if (!courseDoc.exists) {
                console.log(`Course with ID ${courseId} does not exist`);
            }
            const courseData = courseDoc.data();
            return courseData;
        }
    }

    async VerifyCertificateUser(id_user: string, id_course: string, token: any) {
        const ref_doc_certificate = await collection_account.doc(id_user).collection("Certificate").where('id_course', '==', id_course).get()
        const Into_Certificate = ref_doc_certificate.docs.map((item: any, index: number) => {
            return { ...item.data(), id_document: item.id }
        })
        const token_in_firebase = Into_Certificate[0].token
        const id_document_token = Into_Certificate[0].id_document
        if (token_in_firebase === token) {
            console.log('verify true')
            return { token_in_firebase, id_document_token, verify: true }
        } else {
            console.log('verify false')
            return { verify: false }
        }
    }
}

