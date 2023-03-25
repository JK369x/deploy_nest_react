import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SignInDataDto } from './dto/signin_data_dto';
import { JwtService } from '@nestjs/jwt';
import { ResultOption } from 'Guards/jwtinterface';
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';
import { collection_account } from 'src/database/firebase/firebase_config';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService) { }
    async SignIn({ email, password, cookie }: SignInDataDto) {
        console.log("🚀 ~ file: auth.service.ts:13 ~ AuthService ~ SignIn ~ email:", email)
        try {
            const data = await this.userService.findOneUser(email)
            const salt = data[0].data().salt
            const expiresIn = '604800s';
            const password_firebase = data[0].data().password
            const password_hash = bcrypt.hashSync(password, salt)
            if (password_hash === password_firebase) {
                const documentRef = collection_account.doc(data[0].id);
                const id_document = documentRef.id;
                const { status, updateDate, firstName, lastName, favorite, course_join, image_rul, about } = data[0].data()
                const displayName = `${firstName} ${lastName}`
                const exp = Date.now()
                const payload: ResultOption = {
                    email,
                    id_document,
                    favorite,
                    status: status,
                    updateDate,
                    exp,
                    cookie,
                    display_name: displayName,
                    course_join,
                    image_rul,
                    about,
                }
                //! object sign
                const authToken = this.jwtService.sign({ payload }, { expiresIn })
                console.log("create token JWT :", authToken)
                this.userService.setUser(payload)

                let dataReturn: any = {
                    ...data[0].data(),
                    id_document,
                    token: authToken,
                }
                return dataReturn
            } else {
                throw new UnauthorizedException({ message: 'CodeError.password_hash test' })
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async SignInMobile({ email, password, cookie }: SignInDataDto) {
        try {
            const data = await this.userService.findOneUser(email)
            const salt = data[0].data().salt
            const expiresIn = '604800s';
            const password_firebase = data[0].data().password
            const password_hash = bcrypt.hashSync(password, salt)
            if (password_hash === password_firebase) {
                const documentRef = collection_account.doc(data[0].id);
                const id_document = documentRef.id;
                const { status, updateDate, firstName, lastName, favorite, course_join, image_rul, about } = data[0].data()
                console.table(data[0].data())
                const displayName = `${firstName} ${lastName}`
                const exp = Date.now()
                const payload: ResultOption = {
                    email,
                    id_document,
                    favorite,
                    status: status,
                    updateDate,
                    exp,
                    cookie,
                    display_name: displayName,
                    course_join,
                    image_rul,
                    about,
                }
                //! object sign
                const authToken = this.jwtService.sign({ payload }, { expiresIn })
                console.log("create token JWT :", authToken)
                this.userService.setUser(payload)

                let dataReturn: any = {
                    ...data[0].data(),
                    id_document,
                    token: authToken,
                }
                return dataReturn
            } else {
                throw new UnauthorizedException({ message: 'CodeError.password_hash test' })
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async AutoSignIn(user: any) {
        console.log('==============Auto==============')
        try {
            const email = user.payload.email
            console.log('==============Auto==============')
            const data = await this.userService.findOneUser(email)
            const documentRef = collection_account.doc(data[0].id);
            const id_document = documentRef.id;
            if (data.length !== 1) {
                throw new InternalServerErrorException()
            }
            let dataReturn: any = {
                ...data[0].data(),
                id_document,
                token: user,
            }
            delete dataReturn.password
            delete dataReturn.updateBy
            delete dataReturn.updateDate
            delete dataReturn.createBy
            delete dataReturn.createDate
            return dataReturn
        } catch {
            throw new InternalServerErrorException()
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOneUser(email);
        const newdata = user[0].data().password
        if (newdata && await bcrypt.compare(password, newdata)) {
            const { password, ...result } = user;
            return result;
        }
        return false
    }




}




