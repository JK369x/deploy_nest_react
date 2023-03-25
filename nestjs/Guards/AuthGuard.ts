import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ResultOption } from './jwtInterface'
import { UserService } from 'src/user/user.service'

@Injectable()
class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private userService: UserService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        console.log('Welcome to Guard ')
        try {
            const request = context.switchToHttp().getRequest<Request>()
            const token = request.cookies.access_token
            const user = this.jwtService.verify<ResultOption>(token)
            this.userService.setUser(user)
            return true
        } catch (err) {
            console.log('no token ,no auth')
            return false
        }
    }
}



export default AuthGuard
