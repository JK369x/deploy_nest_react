import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsObject, IsString, ValidateNested } from 'class-validator'
import { Lookup } from '../../type/lookup'
import { Type } from 'class-transformer'

// class WhatWillStudentLearn {
//     @ApiProperty()
//     @IsString()
//     input: string;

// }

// class the_course_consists {
//     @ApiProperty()
//     @IsString()
//     input: string;
// }

export class AddCourseDTO {
    @IsString()
    @ApiProperty()
    title: string

    @IsString()
    @ApiProperty()
    subtitle: string

    @IsString()
    @ApiProperty()
    description: string

    @ValidateNested()
    @ApiProperty({ type: Lookup, required: false })
    category: Lookup | null



    @ApiProperty()
    start_register: Date



    @ApiProperty()
    start_registerEnd: Date



    @ApiProperty()
    start_register_time: Date



    @ApiProperty()
    start_register_end: Date



    @ApiProperty()
    start_course: Date


    @ApiProperty()
    end_course: Date


    @ApiProperty()
    course_date: string


    @ApiProperty()
    course_date_time: string | null

    @ValidateNested()
    @ApiProperty({ type: Lookup, isArray: true })
    course_status: Lookup[] | null


    what_will_student_learn_in_your_course: string[]

    the_course_consists: string[]

    @IsString()
    @ApiProperty()
    who_is_this_course: string

    @IsString()
    @ApiProperty()
    linkteammeeting: string

    @IsString()
    @ApiProperty()
    whataretherequirement: string

    @IsString()
    @ApiProperty()
    image: string

    @IsString()
    @ApiProperty()
    teaching_assistant: string

    @IsString()
    @ApiProperty()
    pricing: string | number

    @ApiProperty()
    create_by_name?: string



    @ApiProperty()
    approval?: boolean

    @ApiProperty()
    btn_quiz?: boolean

    @ApiProperty()
    btn_check_name?: boolean

    @IsString()
    @ApiProperty()
    min_people: string


    @ApiProperty()
    image_create?: string

}