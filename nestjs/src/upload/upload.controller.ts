import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Body, Controller, Post, Put, UploadedFile, UseInterceptors, Param, Get } from '@nestjs/common';
import { ApiConsumes, ApiBody } from '@nestjs/swagger'

@Controller('upload')
export class UploadController {
    constructor(private uploadfile: UploadService) { }

    @Put('uploadimage')
    async UploadBanner(@Body() image_banner: any) {
        const id_banner = await this.uploadfile.GetBannerID()
        const new_id = id_banner.map((item) => { return item.id_document })
        return await this.uploadfile.UploadBanner(new_id, image_banner)
    }

    @Get('getbanner')
    async GetBanner() {
        console.log('banner get')
        const data = this.uploadfile.GetBanner()
        return data
    }


    @Put('defaultbanner/:status_banner')
    async DefaultBanner(@Param('status_banner') status_banner: any) {
        console.log('set default', status_banner)
        const id_banner = await this.uploadfile.GetBannerID()
        const new_id = id_banner.map((item) => { return item.id_document })
        const data = this.uploadfile.SetDefaultBanner(new_id, status_banner)
        return data
    }

    @Post('certificates')
    async SigningCertificate(@Body() pdfData: any,
    ) {
        // Extract the certificate data from the request body

        console.log("🚀 ~ file: up:", pdfData)
        // Convert the PDF file data to a Buffer object


        return pdfData;
    }
}
