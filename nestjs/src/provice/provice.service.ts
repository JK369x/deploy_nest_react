import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProviceService {
    async GetProvince() {
        console.log('service')
        const result = await axios.get(
            'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
        console.log("🚀 ~ file: provice.service.ts:10 ~ ProviceService ~ GetProvince ~ result", result.data)
        return result.data
    }
}
