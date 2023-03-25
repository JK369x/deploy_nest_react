import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CategoryDTO {
    
    id?: string
    @IsString()
    Category_Title: string
}