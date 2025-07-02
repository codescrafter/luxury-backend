import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Product, ProductDocument } from './entities/product.entity';
import { User, UserDocument } from 'src/auth/schemas/user-schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    type: 'jetski' | 'kayak' | 'yacht' | 'speedboat',
    dto: any,
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    user: UserDocument,
  ) {
    const images = files.images
      ? await Promise.all(
          files.images.map((file) =>
            this.cloudinaryService
              .uploadImage(file, 'product-images')
              .then((res) => res.secure_url),
          ),
        )
      : [];

    const videos = files.videos
      ? await Promise.all(
          files.videos.map((file) =>
            this.cloudinaryService
              .uploadVideo(file, 'product-videos')
              .then((res) => res.secure_url),
          ),
        )
      : [];

    const product = new this.productModel({
      ...dto,
      type,
      status: 'pending',
      ownerId: user._id,
      images,
      videos,
    });

    return await product.save();
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    user: UserDocument,
  ) {
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException('Product not found');
    if (product.ownerId.toString() !== user._id.toString())
      throw new ForbiddenException('Access denied');

    const images = files.images
      ? await Promise.all(
          files.images.map((file) =>
            this.cloudinaryService
              .uploadImage(file, 'product-images')
              .then((res) => res.secure_url),
          ),
        )
      : product.images;

    const videos = files.videos
      ? await Promise.all(
          files.videos.map((file) =>
            this.cloudinaryService
              .uploadVideo(file, 'product-videos')
              .then((res) => res.secure_url),
          ),
        )
      : product.videos;

    Object.assign(product, dto, {
      images,
      videos,
      status: 'pending',
    });

    product.resubmissionCount += 1;
    return await product.save();
  }

  async updateStatus(id: string, dto: UpdateProductStatusDto) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    product.status = dto.status;
    return await product.save();
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
