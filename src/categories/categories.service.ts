import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { deleteCloudinaryImage } from 'src/common/multer.middleware';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    const existingCategory = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'categories');
      imageUrl = uploadResult.secure_url;
    }

    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      image: imageUrl,
    });
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: Partial<CreateCategoryDto>,
    file?: Express.Multer.File,
  ): Promise<Category> {
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryModel.findOne({
        name: updateCategoryDto.name,
        _id: { $ne: id },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    let imageUrl = category.image;
    if (file) {
      // Delete old image from Cloudinary if it exists
      if (category.image) {
        await deleteCloudinaryImage(category.image);
      }

      // Upload new image to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'categories');
      imageUrl = uploadResult.secure_url;
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(
        id,
        {
          ...updateCategoryDto,
          image: imageUrl,
        },
        { new: true }
      )
      .exec();

    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Delete image from Cloudinary if it exists
    if (category.image) {
      await deleteCloudinaryImage(category.image);
    }

    await this.categoryModel.deleteOne({ _id: id }).exec();
  }
} 