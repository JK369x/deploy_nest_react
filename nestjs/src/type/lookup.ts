import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsNotEmpty, IsNumberString, IsString, isNotEmpty } from "class-validator"

export class Lookup {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    id: string 
    @IsNotEmpty()


    @IsString()
    @ApiProperty()
    label: string 
 
    @IsNumberString()
    @ApiProperty()
    zipcode?: string 
}


export const roleWeek: Lookup[] = [{
    id: '1',
    label: 'จันทร์',
}, {
    id: '2',
    label: 'อังคาร',
}, {
    id: '3',
    label: 'พุทธ',
},
{
    id: '4',
    label: 'พฤหัส',
},
{
    id: '5',
    label: 'ศุกร์',
},
{
    id: '6',
    label: 'เสาร์',
},
{
    id: '7',
    label: 'อาทิตย์',
},
]


export const typeCourseOnline_Onside: Lookup[] =[{
    id: '1',
    label: 'ONLINE',
}, {
    id: '2',
    label: 'ONSIDE',
},
]
