import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
    private categoriesService: CategoriesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto, images?: Express.Multer.File[]): Promise<Product> {
    try {
      // Verify category exists
      await this.categoriesService.findOne(createProductDto.categoryId);

      let imageUrls: string[] = [];
      if (images && images.length > 0) {
        // Upload images to Cloudinary
        const uploadPromises = images.map(file => 
          this.cloudinaryService.uploadImage(file, 'products')
        );
        const uploadResults = await Promise.all(uploadPromises);
        imageUrls = uploadResults.map(result => result.secure_url);
      }

      const createdProduct = new this.productModel({
        ...createProductDto,
        category: createProductDto.categoryId,
        images: imageUrls,
      });
      return createdProduct.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create product: ' + error.message);
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('category').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('category').exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string, 
    updateProductDto: Partial<CreateProductDto>,
    images?: Express.Multer.File[],
  ): Promise<Product> {
    try {
      if (updateProductDto.categoryId) {
        await this.categoriesService.findOne(updateProductDto.categoryId);
      }

      const product = await this.productModel.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      let imageUrls = product.images;
      if (images && images.length > 0) {
        // Delete old images from Cloudinary
        const deletePromises = product.images.map(imageUrl => 
          this.cloudinaryService.deleteImage(imageUrl)
        );
        await Promise.all(deletePromises);

        // Upload new images to Cloudinary
        const uploadPromises = images.map(file => 
          this.cloudinaryService.uploadImage(file, 'products')
        );
        const uploadResults = await Promise.all(uploadPromises);
        imageUrls = uploadResults.map(result => result.secure_url);
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(
          id,
          {
            ...updateProductDto,
            category: updateProductDto.categoryId,
            images: imageUrls,
          },
          { new: true }
        )
        .populate('category')
        .exec();

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update product: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const product = await this.productModel.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // Delete images from Cloudinary
      const deletePromises = product.images.map(imageUrl => 
        this.cloudinaryService.deleteImage(imageUrl)
      );
      await Promise.all(deletePromises);

      await this.productModel.deleteOne({ _id: id }).exec();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete product: ' + error.message);
    }
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    await this.categoriesService.findOne(categoryId);
    
    return this.productModel
      .find({ category: categoryId })
      .populate('category')
      .exec();
  }
} 