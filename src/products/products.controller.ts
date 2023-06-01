import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    const generatedId = await this.productService.insert(
      prodTitle,
      prodDesc,
      prodPrice,
    );
    return { id: generatedId };
  }

  @Get()
  async getProducts() {
    const products = await this.productService.list();
    return products;
  }

  @Get(':id')
  async getProduct(@Param('id') prodId: string) {
    return await this.productService.getProduct(prodId);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number,
  ) {
    await this.productService.update(prodId, prodTitle, prodDesc, prodPrice);
    return null;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') prodId: string) {
    await this.productService.delete(prodId);
    return null;
  }
}
