import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm'; // 👇 הוספנו IsNull ו-Not
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;
    const product = this.productRepository.create({
      ...productData,
      category: { id: categoryId } as any,
    });
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({
        order: { id: 'DESC' }
    });
  }

  async findTrash() {
      return await this.productRepository.find({
          withDeleted: true, // תביא גם את המחוקים
          where: { deletedAt: Not(IsNull()) }, // תסנן רק את מי שיש לו תאריך מחיקה
          relations: ['category'],
          order: { deletedAt: 'DESC' }
      });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryId, ...productData } = updateProductDto;
    const product = await this.findOne(id);

    const updatedProduct = this.productRepository.merge(product, {
      ...productData,
      category: categoryId ? { id: categoryId } as any : product.category,
    });
    return await this.productRepository.save(updatedProduct);
  }

  // 👇  מחיקה רכה
  async remove(id: number) {
    // משתמשים ב-softDelete במקום delete
    const result = await this.productRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: `Product with ID ${id} has been moved to trash` };
  }

  // 👇 פונקציה חדשה: שחזור מוצר
  async restore(id: number) {
      const result = await this.productRepository.restore(id);
      if (result.affected === 0) {
          throw new NotFoundException(`Product with ID ${id} not found in trash`);
      }
      return { message: `Product with ID ${id} has been restored` };
  }
}