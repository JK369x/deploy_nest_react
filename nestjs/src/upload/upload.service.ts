import { Injectable } from '@nestjs/common';
import { collection_banner } from 'src/database/firebase/firebase_config';

@Injectable()
export class UploadService {
    async UploadBanner(id_banner: string[], image: any) {
        id_banner.map((item) => {
            console.log("id_banner :", item)
            collection_banner.doc(item).update({
                ...image
            })
        })
        return id_banner
    }

    async SetDefaultBanner(id_banner: string[], status: any) {
        id_banner.map((item) => {
            console.log("id_banner :", item)
            collection_banner.doc(item).update({
                default_banner: status
            })
        })
        return id_banner
    }
    async GetBanner() {
        const id_banner = await collection_banner.get()
        const newdata = id_banner.docs.map((item) => { return { ...item.data(), id_document: item.id } })
        return newdata
    }

    async GetBannerID() {
        const id_banner = await collection_banner.get()
        const newdata = id_banner.docs.map((item) => { return { id_document: item.id } })
        return newdata
    }
}
