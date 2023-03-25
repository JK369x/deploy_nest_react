import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Lookup } from "src/type/lookup";


export class UserDto {
    @IsString()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string

    @IsString()
    @ApiProperty()
    @IsOptional()
    image_url: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    createBy: string

    @IsString()
    @ApiProperty()
    job: string

    @IsString()
    @ApiProperty()
    firstName: string

    @IsString()
    @ApiProperty()
    lastName: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    id: string

    @IsString()
    @ApiProperty()
    agency: string


    @ValidateNested()
    @ApiProperty({ type: Lookup, required: false })
    status: string

    @IsString() 
    @ApiProperty()
    address: string

    @ValidateNested()
    @ApiProperty({ type: Lookup, required: false })
    province: string

    @ValidateNested()
    @ApiProperty({ type: Lookup, required: false })
    tambon: string

    @ValidateNested()
    @ApiProperty({ type: Lookup,required: false })
    amphure: string

    @ValidateNested()
    @ApiProperty({ type: Lookup, required: false })
    zipcode: string

}