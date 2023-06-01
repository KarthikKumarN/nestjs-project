import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insert(title: string, des: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: des,
      price,
    });
    const result = await newProduct.save();
    return result.id as string;
  }

  async list() {
    const products = await this.productModel.find().exec();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getProduct(prodId: string) {
    const product = await this.findProduct(prodId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async update(id: string, title: string, des: string, price: number) {
    const updateProduct = await this.findProduct(id);
    updateProduct.title = title ? title : updateProduct.title;
    updateProduct.description = des ? des : updateProduct.description;
    updateProduct.price = price ? price : updateProduct.price;
    await updateProduct.save();
  }

  async delete(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (e) {
      throw new NotFoundException('Product not found');
    }
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
