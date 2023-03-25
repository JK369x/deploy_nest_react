import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './courseDTO/category_dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {
    }
    @Post('createcategory')
    async CreateCategory(@Body() data: CategoryDTO) {
        return this.categoryService.CreateCategory(data)
    }

    @Get('allcategory')
   async GetAllUser(): Promise<any>{
        return await this.categoryService.FindAllCategory()
   }

   @Get('getdetatilcategory/:id')
   async GetDetailUser(@Param('id') id: string ){
       return await this.categoryService.GetDetailCategory(id)
   }

   @Delete('deletecategory/:id')
   async DeleteUser(@Param('id') id: string) {
       console.log("delete user success !!" )
       return await this.categoryService.DeleteCategory(id)
   }

   @Put('editcategory/:id')
   async EditCategory(@Param('id') id: string, @Body() category: any) {
       console.log("update user success !!" )
       return await this.categoryService.EditCategory(id,category)
   }
}
