import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

// const transports = new winston.transports.DailyRotateFile({
//     filename: './logs/error.log',
//     json: true,
//     maxSize: '1k',
//     maxFiles: 10,
// })

// const Logger = winston.createLogger({
//     level: 'error',
//     format: winston.format.json(),
//     transports: [transports],
// })

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        const getRes = exception.getResponse() as any
        let message = ''
        try {
            message = getRes.message
        } catch {
            message = 'get message error'
        }

        const LogData = {
            status,
            path: request.url,
            timestamp: new Date().toISOString(),
            message,
        }

        response.status(status).json(LogData)
    }
}