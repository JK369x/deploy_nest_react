import { ProviceService } from './provice.service';
import { Controller, Get } from '@nestjs/common';

@Controller('provice')
export class ProviceController {
    constructor(private proviceService: ProviceService) { }




    @Get('getapiprovince')
    async GetProvince() {
        console.log('testapi')
        const data = await this.proviceService.GetProvince()
        return data
    }

}
