import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        console.log('validate')
        const lowerEmail = email.toLowerCase()
        const user = await this.authService.validateUser(lowerEmail, password);
        if (!user) {
            throw new UnauthorizedException({
                message: ['Something\'s is wrong not validate user!']
            });
        }
        return user;
    }
}