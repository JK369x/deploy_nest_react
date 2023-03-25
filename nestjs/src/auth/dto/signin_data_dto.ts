import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class SignInDataDto {
    @IsString()
    @ApiProperty()
    email:string
    
    @IsString()
    @ApiProperty()
    password:string


    cookie?: boolean
}