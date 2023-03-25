import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(private jwtService: JwtService) { }
    async use(req: Request, res: Response, next: NextFunction,) {
        console.log("=================AuthMiddleWare🪝=================")
        const token = req.cookies.access_token
        console.log("🚀 ~ file: authmiddleware.ts:13 ~ AuthMiddleWare ~ use ~ tokens")
        try {
            if (!token) {
                console.log(" verify_acc: undefined")
                next()
            }
            else {
                console.log("get token")
                const verify_acc = await this.jwtService.verify(token)
                console.log("Status User Login:", verify_acc.payload.status)
                console.log("Uid User Login:", verify_acc.payload.id_document)
                console.log(`Name User Login: ${verify_acc.payload.display_name}`)
                next()
            }
        } catch (err) {
            console.log("🚀 ~ file: authmiddleware.ts:24 ~ AuthMiddleWare ~ use ~ err:", err)
            console.log("else on verify")
            next()
        }
    }
}