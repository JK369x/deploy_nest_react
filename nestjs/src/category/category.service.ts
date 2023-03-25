import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CategoryDTO } from './courseDTO/category_dto';
import { collection_category } from 'src/database/firebase/firebase_config';

@Injectable()
export class CategoryService {

    async FindAllCategory() {
        const findAllCategory = await collection_category.orderBy("createDate", "desc").get()
        const data = findAllCategory.docs.map((item, index) => {
            return { ...item.data(), id: item.id }
        })
        if (data) {
            return data
        } else {
            throw new InternalServerErrorException({ message: 'not found all user' })
        }
    }

    async DeleteCategory(id: string) {
        console.log("success delete category!!", id)
        return await collection_category.doc(id).delete();
    }

    async GetDetailCategory(id: string) {
        const category = await collection_category.doc(id).get()
        return { ...category.data(), id: category.id}
    }

    async EditCategory(id: string, category: any) {
        console.log("user update :", category)
        return await collection_category.doc(id).update(category);
    }


    async CreateCategory(data: CategoryDTO) {
        try {
            const result = await collection_category.add({
                ...data,
                createDate: new Date(),
                updateDate: new Date(),
            })
            if (result) {
                console.log("🚀 register success id = ", result.id)
            } else {
                console.log('register fail!!')
            }
            return result
        } catch (err) {
            console.log(err)
            return false
        }
    }
}



