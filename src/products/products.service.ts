import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDocument } from 'src/auth/schemas/user-schema';
import { Jetski, JetskiDocument } from './entities/jetski.entity';
import { Kayak, KayakDocument } from './entities/kayak.entity';
import { Yacht, YachtDocument } from './entities/yacht.entity';
import { Speedboat, SpeedboatDocument } from './entities/speedboat.entity';
import { Resort, ResortDocument } from './entities/resort.entity';
import { Unavailability } from './entities/unavailability.entity';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from './entities/booking.entity';

// Define a type for product models that can be used with findById
type ProductModel = Model<any> & {
  findById(id: any): any;
};

import { CreateJetskiDto, UpdateJetskiDto } from './dto/jetski.dto';
import { CreateKayakDto, UpdateKayakDto } from './dto/kayak.dto';
import { CreateYachtDto, UpdateYachtDto } from './dto/yacht.dto';
import { CreateSpeedboatDto, UpdateSpeedboatDto } from './dto/speedboat.dto';
import { CreateResortDto, UpdateResortDto } from './dto/resort.dto';
import { CreateUnavailabilityDto } from './dto/unavailability.dto';
import { CreateBookingDto } from './dto/booking.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  transformProductsArrayForLanguage,
  transformProductsArrayForDualLanguage,
  transformProductForDualLanguage,
} from '../helpers/dto-helpers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Jetski.name)
    private readonly jetSkiModel: Model<JetskiDocument>,
    @InjectModel(Kayak.name) private readonly kayakModel: Model<KayakDocument>,
    @InjectModel(Yacht.name) private readonly yachtModel: Model<YachtDocument>,
    @InjectModel(Speedboat.name)
    private readonly speedboatModel: Model<SpeedboatDocument>,
    @InjectModel(Resort.name)
    private readonly resortModel: Model<ResortDocument>,
    @InjectModel(Unavailability.name)
    private unavailabilityModel: Model<Unavailability>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async uploadImages(files: any[] | undefined, folder: string) {
    if (!files) return [];
    try {
      return await Promise.all(
        files.map((file) =>
          this.cloudinaryService
            .uploadImage(file, folder)
            .then((res) => res.secure_url)
            .catch((error) => {
              console.error('Image upload error:', error);
              throw new HttpException(
                `Failed to upload image: ${error.message}`,
                HttpStatus.BAD_REQUEST,
              );
            }),
        ),
      );
    } catch (error) {
      console.error('Image upload batch error:', error);
      throw new HttpException(
        `Failed to upload images: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async uploadVideos(files: any[] | undefined, folder: string) {
    if (!files) return [];
    try {
      return await Promise.all(
        files.map((file) =>
          this.cloudinaryService
            .uploadVideo(file, folder)
            .then((res) => res.secure_url)
            .catch((error) => {
              console.error('Video upload error:', error);
              throw new HttpException(
                `Failed to upload video: ${error.message}`,
                HttpStatus.BAD_REQUEST,
              );
            }),
        ),
      );
    } catch (error) {
      console.error('Video upload batch error:', error);
      throw new HttpException(
        `Failed to upload videos: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Update product media with proper cleanup of old files
   * This method handles both images and videos with Cloudinary cleanup
   */
  private async updateProductMedia(
    productId: string,
    model: any,
    files: any,
    updateData: any,
  ) {
    const currentProduct = await model.findById(productId);
    if (!currentProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const oldImages = currentProduct.images || [];
    const oldVideos = currentProduct.videos || [];
    let newImages = oldImages;
    let newVideos = oldVideos;

    // Handle new image uploads
    if (files?.images && files.images.length > 0) {
      const uploadedImages = await this.uploadImages(
        files.images,
        'product-images',
      );

      // If replaceImages flag is true, replace all images
      if (updateData.replaceImages) {
        // Delete old images from Cloudinary
        if (oldImages.length > 0) {
          await this.cloudinaryService.deleteMultipleMedia(oldImages, 'image');
        }
        newImages = uploadedImages;
      } else {
        // Append new images to existing ones
        newImages = [...oldImages, ...uploadedImages];
      }
    }

    // Handle new video uploads
    if (files?.videos && files.videos.length > 0) {
      const uploadedVideos = await this.uploadVideos(
        files.videos,
        'product-videos',
      );

      // If replaceVideos flag is true, replace all videos
      if (updateData.replaceVideos) {
        // Delete old videos from Cloudinary
        if (oldVideos.length > 0) {
          await this.cloudinaryService.deleteMultipleMedia(oldVideos, 'video');
        }
        newVideos = uploadedVideos;
      } else {
        // Append new videos to existing ones
        newVideos = [...oldVideos, ...uploadedVideos];
      }
    }

    // Handle specific image deletions
    if (updateData.deleteImageUrls && updateData.deleteImageUrls.length > 0) {
      const imagesToDelete = updateData.deleteImageUrls;
      const remainingImages = newImages.filter(
        (img) => !imagesToDelete.includes(img),
      );

      // Delete specified images from Cloudinary
      await this.cloudinaryService.deleteMultipleMedia(imagesToDelete, 'image');
      newImages = remainingImages;
    }

    // Handle specific video deletions
    if (updateData.deleteVideoUrls && updateData.deleteVideoUrls.length > 0) {
      const videosToDelete = updateData.deleteVideoUrls;
      const remainingVideos = newVideos.filter(
        (video) => !videosToDelete.includes(video),
      );

      // Delete specified videos from Cloudinary
      await this.cloudinaryService.deleteMultipleMedia(videosToDelete, 'video');
      newVideos = remainingVideos;
    }

    return { newImages, newVideos };
  }

  async createJetSkiHandler(
    dto: CreateJetskiDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadImages(files.images, 'product-images');
    const videos = await this.uploadVideos(files.videos, 'product-videos');
    return await new this.jetSkiModel({
      ...dto,
      images,
      videos,
      ownerId: user._id,
      status: 'pending',
    }).save();
  }

  async updateJetSkiHandler(
    id: string,
    dto: UpdateJetskiDto,
    files: any,
    user: UserDocument,
  ) {
    // Validate that the frontend ownerId matches the JWT token user._id
    if (dto.ownerId && dto.ownerId !== user._id.toString()) {
      throw new HttpException(
        'OwnerId mismatch - you can only update your own products',
        HttpStatus.FORBIDDEN,
      );
    }

    // Use the ownerId from the frontend (or fallback to JWT token)
    const ownerId = dto.ownerId || user._id.toString();

    // Handle media updates if files are provided
    if (files?.images || files?.videos) {
      const { newImages, newVideos } = await this.updateProductMedia(
        id,
        this.jetSkiModel,
        files,
        dto,
      );

      // Update with new media URLs and reset status to pending
      return this.jetSkiModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
        { ...dto, images: newImages, videos: newVideos, status: 'pending' },
        { new: true },
      );
    }

    // Regular update without media changes - reset status to pending
    return this.jetSkiModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
      { ...dto, status: 'pending' },
      { new: true },
    );
  }

  async getJetSkiById(id: string, lang?: string) {
    const jetski = await this.jetSkiModel.findById(id).lean();
    if (!jetski) {
      throw new HttpException('Jetski not found', HttpStatus.NOT_FOUND);
    }
    return transformProductForDualLanguage(jetski, lang);
  }

  async createKayakHandler(
    dto: CreateKayakDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadImages(files.images, 'product-images');
    const videos = await this.uploadVideos(files.videos, 'product-videos');
    return await new this.kayakModel({
      ...dto,
      images,
      videos,
      ownerId: user._id,
      status: 'pending',
    }).save();
  }

  async updateKayakHandler(
    id: string,
    dto: UpdateKayakDto,
    files: any,
    user: UserDocument,
  ) {
    // Validate that the frontend ownerId matches the JWT token user._id
    if (dto.ownerId && dto.ownerId !== user._id.toString()) {
      throw new HttpException(
        'OwnerId mismatch - you can only update your own products',
        HttpStatus.FORBIDDEN,
      );
    }

    // Use the ownerId from the frontend (or fallback to JWT token)
    const ownerId = dto.ownerId || user._id.toString();

    // Handle media updates if files are provided
    if (files?.images || files?.videos) {
      const { newImages, newVideos } = await this.updateProductMedia(
        id,
        this.kayakModel,
        files,
        dto,
      );

      // Update with new media URLs and reset status to pending
      return this.kayakModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
        { ...dto, images: newImages, videos: newVideos, status: 'pending' },
        { new: true },
      );
    }

    // Regular update without media changes - reset status to pending
    return this.kayakModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
      { ...dto, status: 'pending' },
      { new: true },
    );
  }

  async getKayakById(id: string, lang?: string) {
    const kayak = await this.kayakModel.findById(id).lean();
    if (!kayak) {
      throw new HttpException('Kayak not found', HttpStatus.NOT_FOUND);
    }
    return transformProductForDualLanguage(kayak, lang);
  }

  async createYachtHandler(
    dto: CreateYachtDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadImages(files.images, 'product-images');
    const videos = await this.uploadVideos(files.videos, 'product-videos');
    return await new this.yachtModel({
      ...dto,
      images,
      videos,
      ownerId: user._id,
      status: 'pending',
    }).save();
  }

  async updateYachtHandler(
    id: string,
    dto: UpdateYachtDto,
    files: any,
    user: UserDocument,
  ) {
    // Validate that the frontend ownerId matches the JWT token user._id
    if (dto.ownerId && dto.ownerId !== user._id.toString()) {
      throw new HttpException(
        'OwnerId mismatch - you can only update your own products',
        HttpStatus.FORBIDDEN,
      );
    }

    // Use the ownerId from the frontend (or fallback to JWT token)
    const ownerId = dto.ownerId || user._id.toString();

    // Handle media updates if files are provided
    if (files?.images || files?.videos) {
      const { newImages, newVideos } = await this.updateProductMedia(
        id,
        this.yachtModel,
        files,
        dto,
      );

      // Update with new media URLs and reset status to pending
      return this.yachtModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
        { ...dto, images: newImages, videos: newVideos, status: 'pending' },
        { new: true },
      );
    }

    // Regular update without media changes - reset status to pending
    return this.yachtModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
      { ...dto, status: 'pending' },
      { new: true },
    );
  }

  async getYachtById(id: string, lang?: string) {
    const yacht = await this.yachtModel.findById(id).lean();
    if (!yacht) {
      throw new HttpException('Yacht not found', HttpStatus.NOT_FOUND);
    }
    return transformProductForDualLanguage(yacht, lang);
  }

  async createSpeedboatHandler(
    dto: CreateSpeedboatDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadImages(files.images, 'product-images');
    const videos = await this.uploadVideos(files.videos, 'product-videos');
    return await new this.speedboatModel({
      ...dto,
      images,
      videos,
      ownerId: user._id,
      status: 'pending',
    }).save();
  }

  async updateSpeedboatHandler(
    id: string,
    dto: UpdateSpeedboatDto,
    files: any,
    user: UserDocument,
  ) {
    // Validate that the frontend ownerId matches the JWT token user._id
    if (dto.ownerId && dto.ownerId !== user._id.toString()) {
      throw new HttpException(
        'OwnerId mismatch - you can only update your own products',
        HttpStatus.FORBIDDEN,
      );
    }

    // Use the ownerId from the frontend (or fallback to JWT token)
    const ownerId = dto.ownerId || user._id.toString();

    // Handle media updates if files are provided
    if (files?.images || files?.videos) {
      const { newImages, newVideos } = await this.updateProductMedia(
        id,
        this.speedboatModel,
        files,
        dto,
      );

      // Update with new media URLs and reset status to pending
      return this.speedboatModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
        { ...dto, images: newImages, videos: newVideos, status: 'pending' },
        { new: true },
      );
    }

    // Regular update without media changes - reset status to pending
    return this.speedboatModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
      { ...dto, status: 'pending' },
      { new: true },
    );
  }

  async getSpeedboatById(id: string, lang?: string) {
    const speedboat = await this.speedboatModel.findById(id).lean();
    if (!speedboat) {
      throw new HttpException('Speedboat not found', HttpStatus.NOT_FOUND);
    }
    return transformProductForDualLanguage(speedboat, lang);
  }

  async createResortHandler(
    dto: CreateResortDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadImages(files.images, 'product-images');
    const videos = await this.uploadVideos(files.videos, 'product-videos');
    return await new this.resortModel({
      ...dto,
      images,
      videos,
      ownerId: user._id,
      status: 'pending',
    }).save();
  }

  async updateResortHandler(
    id: string,
    dto: UpdateResortDto,
    files: any,
    user: UserDocument,
  ) {
    // Validate that the frontend ownerId matches the JWT token user._id
    if (dto.ownerId && dto.ownerId !== user._id.toString()) {
      throw new HttpException(
        'OwnerId mismatch - you can only update your own products',
        HttpStatus.FORBIDDEN,
      );
    }

    // Use the ownerId from the frontend (or fallback to JWT token)
    const ownerId = dto.ownerId || user._id.toString();

    // Handle media updates if files are provided
    if (files?.images || files?.videos) {
      const { newImages, newVideos } = await this.updateProductMedia(
        id,
        this.resortModel,
        files,
        dto,
      );

      // Update with new media URLs and reset status to pending
      return this.resortModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
        { ...dto, images: newImages, videos: newVideos, status: 'pending' },
        { new: true },
      );
    }

    // Regular update without media changes - reset status to pending
    return this.resortModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
      { ...dto, status: 'pending' },
      { new: true },
    );
  }

  async getResortById(id: string, lang?: string) {
    const resort = await this.resortModel.findById(id).lean();
    if (!resort) {
      throw new HttpException('Resort not found', HttpStatus.NOT_FOUND);
    }
    return transformProductForDualLanguage(resort, lang);
  }

  /**
   * Get all approved products from all models
   */
  async getProducts(lang: string = 'en') {
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: 'approved' }).lean(),
      this.kayakModel.find({ status: 'approved' }).lean(),
      this.yachtModel.find({ status: 'approved' }).lean(),
      this.speedboatModel.find({ status: 'approved' }).lean(),
      this.resortModel.find({ status: 'approved' }).lean(),
    ]);
    const allProducts = [
      ...jetskis,
      ...kayaks,
      ...yachts,
      ...speedboats,
      ...resorts,
    ];
    return transformProductsArrayForLanguage(allProducts, lang);
  }

  /**
   * Get all approved products from all models with dual-language support
   */
  async getProductsWithDualLanguage(displayLang: string = 'en') {
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: 'approved' }).lean(),
      this.kayakModel.find({ status: 'approved' }).lean(),
      this.yachtModel.find({ status: 'approved' }).lean(),
      this.speedboatModel.find({ status: 'approved' }).lean(),
      this.resortModel.find({ status: 'approved' }).lean(),
    ]);
    const allProducts = [
      ...jetskis,
      ...kayaks,
      ...yachts,
      ...speedboats,
      ...resorts,
    ];
    return transformProductsArrayForDualLanguage(allProducts, displayLang);
  }

  /**
   * Get all approved products with pagination and dual-language support
   */
  async getProductsWithDualLanguageAndPagination(
    displayLang: string = 'en',
    page: number = 1,
    limit: number = 20,
  ) {
    const filter = { status: 'approved' };
    const skip = (page - 1) * limit;

    // Get total count
    const [jetskiCount, kayakCount, yachtCount, speedboatCount, resortCount] =
      await Promise.all([
        this.jetSkiModel.countDocuments(filter),
        this.kayakModel.countDocuments(filter),
        this.yachtModel.countDocuments(filter),
        this.speedboatModel.countDocuments(filter),
        this.resortModel.countDocuments(filter),
      ]);

    const totalCount =
      jetskiCount + kayakCount + yachtCount + speedboatCount + resortCount;

    // Get paginated data
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find(filter).skip(skip).limit(limit).lean(),
      this.kayakModel.find(filter).skip(skip).limit(limit).lean(),
      this.yachtModel.find(filter).skip(skip).limit(limit).lean(),
      this.speedboatModel.find(filter).skip(skip).limit(limit).lean(),
      this.resortModel.find(filter).skip(skip).limit(limit).lean(),
    ]);

    const allProducts = [
      ...jetskis,
      ...kayaks,
      ...yachts,
      ...speedboats,
      ...resorts,
    ];

    const transformedProducts = transformProductsArrayForDualLanguage(
      allProducts,
      displayLang,
    );

    return {
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getProductsByOwnerAndStatus(
    statuses: string[],
    ownerId?: string,
    lang: string = 'en',
  ) {
    const filter: any = {
      status: { $in: statuses },
    };

    if (ownerId) {
      filter.ownerId = new Types.ObjectId(ownerId);
    }

    // If ownerId is not provided, it's an admin request: populate owner details
    const populateOwner = !ownerId;

    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      populateOwner
        ? this.jetSkiModel.find(filter).populate('ownerId').lean()
        : this.jetSkiModel.find(filter).lean(),
      populateOwner
        ? this.kayakModel.find(filter).populate('ownerId').lean()
        : this.kayakModel.find(filter).lean(),
      populateOwner
        ? this.yachtModel.find(filter).populate('ownerId').lean()
        : this.yachtModel.find(filter).lean(),
      populateOwner
        ? this.speedboatModel.find(filter).populate('ownerId').lean()
        : this.speedboatModel.find(filter).lean(),
      populateOwner
        ? this.resortModel.find(filter).populate('ownerId').lean()
        : this.resortModel.find(filter).lean(),
    ]);

    const allProducts = [
      ...jetskis,
      ...kayaks,
      ...yachts,
      ...speedboats,
      ...resorts,
    ];
    return transformProductsArrayForLanguage(allProducts, lang);
  }

  /**
   * Get products by owner and status with dual-language support
   * This method returns both languages in the response with a displayLang field
   */
  async getProductsByOwnerAndStatusWithDualLanguage(
    statuses: string[],
    ownerId?: string,
    displayLang?: string,
  ) {
    const filter: any = {
      status: { $in: statuses },
    };

    if (ownerId) {
      filter.ownerId = new Types.ObjectId(ownerId);
    }

    // If ownerId is not provided, it's an admin request: populate owner details
    const populateOwner = !ownerId;

    // Optimized projection - only fetch needed fields
    const projection = {
      // Essential fields
      _id: 1,
      type: 1,
      status: 1,
      ownerId: 1,
      createdAt: 1,
      updatedAt: 1,

      // Language fields (both languages)
      titleEn: 1,
      titleAr: 1,
      descriptionEn: 1,
      descriptionAr: 1,
      cancellationPolicyEn: 1,
      cancellationPolicyAr: 1,
      termsAndConditionsEn: 1,
      termsAndConditionsAr: 1,
      cityEn: 1,
      cityAr: 1,
      regionEn: 1,
      regionAr: 1,
      countryEn: 1,
      countryAr: 1,
      addressEn: 1,
      addressAr: 1,
      tagsEn: 1,
      tagsAr: 1,

      // Product-specific fields
      pricePerHour: 1,
      pricePerDay: 1,
      capacity: 1,
      maxSpeed: 1,
      brand: 1,
      modelYear: 1,

      // Resort-specific fields
      amenitiesEn: 1,
      amenitiesAr: 1,
      safetyFeaturesEn: 1,
      safetyFeaturesAr: 1,
      dailyPrice: 1,
      yearlyPrice: 1,
      numberOfRooms: 1,
      starRating: 1,

      // Images and videos
      images: 1,
      videos: 1,
    };

    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      populateOwner
        ? this.jetSkiModel.find(filter, projection).populate('ownerId').lean()
        : this.jetSkiModel.find(filter, projection).lean(),
      populateOwner
        ? this.kayakModel.find(filter, projection).populate('ownerId').lean()
        : this.kayakModel.find(filter, projection).lean(),
      populateOwner
        ? this.yachtModel.find(filter, projection).populate('ownerId').lean()
        : this.yachtModel.find(filter, projection).lean(),
      populateOwner
        ? this.speedboatModel
            .find(filter, projection)
            .populate('ownerId')
            .lean()
        : this.speedboatModel.find(filter, projection).lean(),
      populateOwner
        ? this.resortModel.find(filter, projection).populate('ownerId').lean()
        : this.resortModel.find(filter, projection).lean(),
    ]);

    const allProducts = [
      ...jetskis,
      ...kayaks,
      ...yachts,
      ...speedboats,
      ...resorts,
    ];
    return transformProductsArrayForDualLanguage(allProducts, displayLang);
  }

  async approveOrRejectProduct(
    type: string,
    id: string,
    action: 'approve' | 'revision' | 'reject',
  ) {
    let model;
    switch (type) {
      case 'jetski':
        model = this.jetSkiModel;
        break;
      case 'kayak':
        model = this.kayakModel;
        break;
      case 'yacht':
        model = this.yachtModel;
        break;
      case 'speedboat':
        model = this.speedboatModel;
        break;
      case 'resort':
        model = this.resortModel;
        break;
      default:
        throw new Error('Invalid product type');
    }

    let update: any = {};
    if (action === 'approve') {
      // FIXED: Don't reset resubmissionCount when approving
      update = { status: 'approved' };
    } else if (action === 'revision') {
      update = { status: 'revision', $inc: { resubmissionCount: 1 } };
    } else if (action === 'reject') {
      // FIXED: Don't increment resubmissionCount when rejecting
      update = { status: 'rejected' };
    } else {
      throw new Error('Invalid action');
    }

    const result = await model.findByIdAndUpdate(id, update, { new: true });
    if (!result) throw new Error('Product not found');
    return result;
  }

  async resubmitProduct(type: string, id: string) {
    let model;
    switch (type) {
      case 'jetski':
        model = this.jetSkiModel;
        break;
      case 'kayak':
        model = this.kayakModel;
        break;
      case 'yacht':
        model = this.yachtModel;
        break;
      case 'speedboat':
        model = this.speedboatModel;
        break;
      case 'resort':
        model = this.resortModel;
        break;
      default:
        throw new Error('Invalid product type');
    }
    const result = await model.findByIdAndUpdate(
      id,
      { status: 'pending', $inc: { resubmissionCount: 1 } },
      { new: true },
    );
    if (!result) throw new Error('Product not found');
    return result;
  }

  async createUnavailability(dto: CreateUnavailabilityDto) {
    // 1. Validate startTime and endTime
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new HttpException(
        'Invalid startTime or endTime',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (start >= end) {
      throw new HttpException(
        'startTime must be before endTime',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 2. Check not in the past
    const now = new Date();
    if (start < now) {
      throw new HttpException(
        'Cannot add unavailability in the past',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 3. Check for overlapping unavailability
    const overlap = await this.unavailabilityModel.findOne({
      productId: dto.productId,
      productType: dto.productType,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    if (overlap) {
      throw new HttpException(
        'Unavailability already exists for this time range',
        HttpStatus.CONFLICT,
      );
    }
    // 4. Create unavailability
    return this.unavailabilityModel.create(dto);
  }

  async createBooking(dto: CreateBookingDto, consumerId: string) {
    // 1. Validate startTime and endTime
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new HttpException(
        'Invalid startTime or endTime',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (start >= end) {
      throw new HttpException(
        'startTime must be before endTime',
        HttpStatus.BAD_REQUEST,
      );
    }
    const now = new Date();
    if (start < now) {
      throw new HttpException(
        'Cannot book in the past',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 2. Check for overlapping unavailability and confirmed bookings
    const overlap = await this.unavailabilityModel.findOne({
      productId: dto.productId,
      productType: dto.productType,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    if (overlap) {
      throw new HttpException(
        'Product is unavailable for this time range',
        HttpStatus.CONFLICT,
      );
    }
    // Also check for overlapping confirmed bookings
    const overlappingBooking = await this.bookingModel.findOne({
      productId: dto.productId,
      productType: dto.productType,
      bookingStatus: {
        $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      },
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    if (overlappingBooking) {
      throw new HttpException(
        'Product is already booked for this time range',
        HttpStatus.CONFLICT,
      );
    }

    let product: any;
    switch (dto.productType) {
      case 'jetski':
        product = await this.jetSkiModel.findById(dto.productId);
        break;
      case 'kayak':
        product = await this.kayakModel.findById(dto.productId);
        break;
      case 'yacht':
        product = await this.yachtModel.findById(dto.productId);
        break;
      case 'speedboat':
        product = await this.speedboatModel.findById(dto.productId);
        break;
      case 'resort':
        product = await this.resortModel.findById(dto.productId);
        break;
      default:
        throw new HttpException('Invalid product type', HttpStatus.BAD_REQUEST);
    }

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    const finalPartnerId = product.ownerId;

    // Calculate expected price based on product type
    let expectedPrice = 0;
    const durationMs = end.getTime() - start.getTime();
    const hours = durationMs / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);

    if (dto.productType === 'resort') {
      if (days >= 365 && product.yearlyPrice) {
        expectedPrice = product.yearlyPrice;
      } else if (product.dailyPrice) {
        expectedPrice = days * product.dailyPrice;
      } else {
        throw new HttpException(
          'Resort does not have pricing info',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      if (product.pricePerDay && hours >= 24) {
        expectedPrice = Math.ceil(hours / 24) * product.pricePerDay;
      } else if (product.pricePerHour) {
        // Allow booking by half-hour increments (minimum 0.5 hour)
        const halfHourBlocks = Math.round(hours * 2) / 2;
        if (halfHourBlocks < 0.5) {
          throw new HttpException(
            'Minimum booking duration is 0.5 hour',
            HttpStatus.BAD_REQUEST,
          );
        }
        expectedPrice = halfHourBlocks * product.pricePerHour;
      } else {
        throw new HttpException(
          'Product does not have pricing info',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (dto.totalPrice !== expectedPrice) {
      throw new HttpException(
        `Total price does not match expected price (${expectedPrice})`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // 4. Create booking (without creating unavailability yet)
    const booking = await this.bookingModel.create({
      ...dto,
      consumerId,
      partnerId: finalPartnerId,
      paymentStatus: PaymentStatus.PENDING,
      bookingStatus: BookingStatus.PENDING,
      startTime: start,
      endTime: end,
    });
    return booking;
  }

  async approveBooking(bookingId: string, partnerId: string) {
    const booking = await this.bookingModel.findOne({
      _id: bookingId,
      partnerId,
    });
    if (!booking) {
      throw new HttpException(
        'Booking not found or unauthorized',
        HttpStatus.NOT_FOUND,
      );
    }
    if (booking.bookingStatus !== BookingStatus.PENDING) {
      throw new HttpException(
        'Only pending bookings can be approved',
        HttpStatus.BAD_REQUEST,
      );
    }
    booking.bookingStatus = BookingStatus.CONFIRMED;
    await booking.save();

    // Create unavailability for this booking after partner approval (if not already created)
    const existingUnavailability = await this.unavailabilityModel.findOne({
      productId: booking.productId,
      consumerId: booking.consumerId,
      productType: booking.productType,
      unavailabilityType: 'booked',
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    if (!existingUnavailability) {
      await this.unavailabilityModel.create({
        productId: booking.productId,
        consumerId: booking.consumerId,
        productType: booking.productType,
        unavailabilityType: 'booked',
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    }

    return booking;
  }

  async rejectBooking(
    bookingId: string,
    partnerId: string,
    cancellationReason?: string,
  ) {
    const booking = await this.bookingModel.findOne({
      _id: bookingId,
      partnerId,
    });
    if (!booking) {
      throw new HttpException(
        'Booking not found or unauthorized',
        HttpStatus.NOT_FOUND,
      );
    }
    if (booking.bookingStatus !== BookingStatus.PENDING) {
      throw new HttpException(
        'Only pending bookings can be rejected',
        HttpStatus.BAD_REQUEST,
      );
    }
    booking.bookingStatus = BookingStatus.CANCELLED;
    booking.cancellationReason = cancellationReason || 'Rejected by partner';
    await booking.save();
    // Remove the unavailability for this booking
    await this.unavailabilityModel.deleteOne({
      productId: booking.productId,
      consumerId: booking.consumerId,
      productType: booking.productType,
      unavailabilityType: 'booked',
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
    return booking;
  }

  async confirmPayment(bookingId: string, transactionId: string) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    if (booking.paymentStatus === PaymentStatus.PAID) {
      throw new HttpException(
        'Payment already confirmed',
        HttpStatus.BAD_REQUEST,
      );
    }
    booking.paymentStatus = PaymentStatus.PAID;
    booking.transactionId = transactionId;
    if (booking.bookingStatus !== BookingStatus.CANCELLED) {
      booking.bookingStatus = BookingStatus.CONFIRMED;
    }
    await booking.save();

    // Create unavailability for this booking after payment confirmation (if not already created)
    const existingUnavailability = await this.unavailabilityModel.findOne({
      productId: booking.productId,
      consumerId: booking.consumerId,
      productType: booking.productType,
      unavailabilityType: 'booked',
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    if (!existingUnavailability) {
      await this.unavailabilityModel.create({
        productId: booking.productId,
        consumerId: booking.consumerId,
        productType: booking.productType,
        unavailabilityType: 'booked',
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    }

    return booking;
  }

  async cancelBooking(
    bookingId: string,
    userId: Types.ObjectId,
    reason?: string,
  ) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }
    //  only partner and consumer can cancel
    if (
      !booking.consumerId.equals(userId) &&
      !booking.partnerId.equals(userId)
    ) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }
    if (
      booking.bookingStatus === BookingStatus.CANCELLED ||
      booking.bookingStatus === BookingStatus.COMPLETED
    ) {
      throw new HttpException(
        'Cannot cancel this booking',
        HttpStatus.BAD_REQUEST,
      );
    }
    booking.bookingStatus = BookingStatus.CANCELLED;
    booking.cancellationReason = reason || 'Cancelled';
    await booking.save();
    // Remove the unavailability for this booking
    await this.unavailabilityModel.deleteOne({
      productId: booking.productId,
      consumerId: booking.consumerId,
      productType: booking.productType,
      unavailabilityType: 'booked',
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
    return booking;
  }

  async completeBooking(bookingId: string, partnerId: string) {
    const booking = await this.bookingModel.findOne({
      _id: bookingId,
      partnerId,
    });
    if (!booking) {
      throw new HttpException(
        'Booking not found or unauthorized',
        HttpStatus.NOT_FOUND,
      );
    }
    if (booking.bookingStatus !== BookingStatus.CONFIRMED) {
      throw new HttpException(
        'Only confirmed bookings can be completed',
        HttpStatus.BAD_REQUEST,
      );
    }
    booking.bookingStatus = BookingStatus.COMPLETED;
    await booking.save();
    return booking;
  }

  getModelBasedOnProductType(productType: string): ProductModel {
    // speedboat, jetski, kayak, yacht, resort
    switch (productType) {
      case 'speedboat':
        return this.speedboatModel;
      case 'jetski':
        return this.jetSkiModel;
      case 'kayak':
        return this.kayakModel;
      case 'yacht':
        return this.yachtModel;
      case 'resort':
        return this.resortModel;
      default:
        throw new Error('Invalid product type');
    }
  }

  async getBookingsForConsumer(consumerId: string): Promise<any[]> {
    const bookings = await this.bookingModel
      .find({ consumerId: new Types.ObjectId(consumerId) })
      .populate('partnerId')
      .lean();

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const model = this.getModelBasedOnProductType(booking.productType);
        if (model) {
          const product = await model.findById(booking.productId).lean();
          return { ...booking, productId: product };
        }
        return booking;
      }),
    );

    return populatedBookings;
  }

  async getBookingsForPartner(partnerId: string): Promise<any[]> {
    const bookings = await this.bookingModel
      .find({ partnerId: new Types.ObjectId(partnerId) })
      .populate('consumerId')
      .lean();

    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const model = this.getModelBasedOnProductType(booking.productType);
        if (model) {
          const product = await model.findById(booking.productId).lean();
          return { ...booking, productId: product };
        }
        return booking;
      }),
    );

    return populatedBookings;
  }

  async getBookingByIdForUserOrPartner(bookingId: string, userId: string) {
    const booking = await this.bookingModel.findById(
      new Types.ObjectId(bookingId),
    );
    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    if (
      !booking.consumerId.equals(userId) &&
      !booking.partnerId.equals(userId)
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return booking;
  }

  /**
   * Get related products based on current product
   * Finds similar products based on type, price, capacity, brand, location, and tags
   */
  async getRelatedProducts(
    productType: string,
    productId: string,
    limit: number = 10,
    lang?: string,
  ) {
    try {
      // Get the current product details
      let model: any;

      switch (productType) {
        case 'jetski':
          model = this.jetSkiModel;
          break;
        case 'kayak':
          model = this.kayakModel;
          break;
        case 'yacht':
          model = this.yachtModel;
          break;
        case 'speedboat':
          model = this.speedboatModel;
          break;
        case 'resort':
          model = this.resortModel;
          break;
        default:
          throw new HttpException(
            'Invalid product type',
            HttpStatus.BAD_REQUEST,
          );
      }

      const currentProduct = await model.findById(productId).lean();
      if (!currentProduct) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      // Build similarity criteria
      const similarityCriteria: any = {
        status: 'approved',
        _id: { $ne: new Types.ObjectId(productId) }, // Exclude current product
      };

      // Price range similarity (within 20% of current product price)
      let priceField = 'pricePerHour';
      if (productType === 'resort') {
        priceField = 'dailyPrice';
      }

      if (currentProduct[priceField]) {
        const currentPrice = currentProduct[priceField];
        const priceRange = currentPrice * 0.2; // 20% range
        similarityCriteria[priceField] = {
          $gte: currentPrice - priceRange,
          $lte: currentPrice + priceRange,
        };
      }

      // Capacity similarity (within 2 people difference)
      if (currentProduct.capacity) {
        const currentCapacity = currentProduct.capacity;
        similarityCriteria.capacity = {
          $gte: Math.max(1, currentCapacity - 2),
          $lte: currentCapacity + 2,
        };
      }

      // Brand similarity (if available)
      if (currentProduct.brand && productType !== 'resort') {
        similarityCriteria.brand = currentProduct.brand;
      }

      // Location similarity (city/region)
      if (currentProduct.cityEn) {
        similarityCriteria.cityEn = currentProduct.cityEn;
      }

      // Get related products from the same type
      let relatedProducts = await model
        .find(similarityCriteria)
        .limit(limit)
        .lean();

      // If we don't have enough products with strict criteria, relax the constraints
      if (relatedProducts.length < limit) {
        const relaxedCriteria = {
          status: 'approved',
          _id: { $ne: new Types.ObjectId(productId) },
        };

        // Only use price range if we have it
        if (currentProduct[priceField]) {
          const currentPrice = currentProduct[priceField];
          const priceRange = currentPrice * 0.5; // Relax to 50% range
          relaxedCriteria[priceField] = {
            $gte: currentPrice - priceRange,
            $lte: currentPrice + priceRange,
          };
        }

        const additionalProducts = await model
          .find(relaxedCriteria)
          .limit(limit - relatedProducts.length)
          .lean();

        // Combine and remove duplicates
        const allProducts = [...relatedProducts, ...additionalProducts];
        const seenIds = new Set();
        relatedProducts = allProducts.filter((product) => {
          if (seenIds.has(product._id.toString())) {
            return false;
          }
          seenIds.add(product._id.toString());
          return true;
        });
      }

      // If still not enough, get any approved products of the same type
      if (relatedProducts.length < limit) {
        const fallbackCriteria = {
          status: 'approved',
          _id: { $ne: new Types.ObjectId(productId) },
        };

        const fallbackProducts = await model
          .find(fallbackCriteria)
          .limit(limit - relatedProducts.length)
          .lean();

        const allProducts = [...relatedProducts, ...fallbackProducts];
        const seenIds = new Set();
        relatedProducts = allProducts.filter((product) => {
          if (seenIds.has(product._id.toString())) {
            return false;
          }
          seenIds.add(product._id.toString());
          return true;
        });
      }

      // Transform for dual language support
      return transformProductsArrayForDualLanguage(relatedProducts, lang);
    } catch (error) {
      console.error('Error getting related products:', error);
      throw new HttpException(
        'Failed to get related products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get unavailability for a product by productId and type, only if user is owner
   */
  async getUnavailabilityForProduct(type: string, productId: string) {
    let product;
    switch (type) {
      case 'jetski':
        product = await this.jetSkiModel.findById(productId);
        break;
      case 'kayak':
        product = await this.kayakModel.findById(productId);
        break;
      case 'yacht':
        product = await this.yachtModel.findById(productId);
        break;
      case 'speedboat':
        product = await this.speedboatModel.findById(productId);
        break;
      case 'resort':
        product = await this.resortModel.findById(productId);
        break;
      default:
        throw new HttpException('Invalid product type', HttpStatus.BAD_REQUEST);
    }
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return this.unavailabilityModel.find({ productId, productType: type });
  }

  /**
   * Get products by owner and status with pagination and dual-language support
   * This method provides pagination for better performance
   */
  async getProductsByOwnerAndStatusWithPagination(
    statuses: string[],
    ownerId?: string,
    displayLang?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const startTime = Date.now();

    try {
      const filter: any = {
        status: { $in: statuses },
      };

      if (ownerId) {
        filter.ownerId = new Types.ObjectId(ownerId);
      }

      // If ownerId is not provided, it's an admin request: populate owner details
      const populateOwner = !ownerId;

      // Optimized projection - only fetch needed fields
      const projection = {
        // Essential fields
        _id: 1,
        type: 1,
        status: 1,
        ownerId: 1,
        createdAt: 1,
        updatedAt: 1,

        // Language fields (both languages)
        titleEn: 1,
        titleAr: 1,
        descriptionEn: 1,
        descriptionAr: 1,
        cancellationPolicyEn: 1,
        cancellationPolicyAr: 1,
        termsAndConditionsEn: 1,
        termsAndConditionsAr: 1,
        cityEn: 1,
        cityAr: 1,
        regionEn: 1,
        regionAr: 1,
        countryEn: 1,
        countryAr: 1,
        addressEn: 1,
        addressAr: 1,
        tagsEn: 1,
        tagsAr: 1,

        // Product-specific fields
        pricePerHour: 1,
        pricePerDay: 1,
        capacity: 1,
        maxSpeed: 1,
        brand: 1,
        modelYear: 1,

        // Resort-specific fields
        amenitiesEn: 1,
        amenitiesAr: 1,
        safetyFeaturesEn: 1,
        safetyFeaturesAr: 1,
        dailyPrice: 1,
        yearlyPrice: 1,
        numberOfRooms: 1,
        starRating: 1,

        // Images and videos
        images: 1,
        videos: 1,
      };

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const [jetskiCount, kayakCount, yachtCount, speedboatCount, resortCount] =
        await Promise.all([
          this.jetSkiModel.countDocuments(filter),
          this.kayakModel.countDocuments(filter),
          this.yachtModel.countDocuments(filter),
          this.speedboatModel.countDocuments(filter),
          this.resortModel.countDocuments(filter),
        ]);

      const totalCount =
        jetskiCount + kayakCount + yachtCount + speedboatCount + resortCount;

      // Get paginated data
      const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
        populateOwner
          ? this.jetSkiModel
              .find(filter, projection)
              .populate('ownerId')
              .skip(skip)
              .limit(limit)
              .lean()
          : this.jetSkiModel
              .find(filter, projection)
              .skip(skip)
              .limit(limit)
              .lean(),
        populateOwner
          ? this.kayakModel
              .find(filter, projection)
              .populate('ownerId')
              .skip(skip)
              .limit(limit)
              .lean()
          : this.kayakModel
              .find(filter, projection)
              .skip(skip)
              .limit(limit)
              .lean(),
        populateOwner
          ? this.yachtModel
              .find(filter, projection)
              .populate('ownerId')
              .skip(skip)
              .limit(limit)
              .lean()
          : this.yachtModel
              .find(filter, projection)
              .skip(skip)
              .limit(limit)
              .lean(),
        populateOwner
          ? this.speedboatModel
              .find(filter, projection)
              .populate('ownerId')
              .skip(skip)
              .limit(limit)
              .lean()
          : this.speedboatModel
              .find(filter, projection)
              .skip(skip)
              .limit(limit)
              .lean(),
        populateOwner
          ? this.resortModel
              .find(filter, projection)
              .populate('ownerId')
              .skip(skip)
              .limit(limit)
              .lean()
          : this.resortModel
              .find(filter, projection)
              .skip(skip)
              .limit(limit)
              .lean(),
      ]);

      const allProducts = [
        ...jetskis,
        ...kayaks,
        ...yachts,
        ...speedboats,
        ...resorts,
      ];

      const transformedProducts = transformProductsArrayForDualLanguage(
        allProducts,
        displayLang,
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Log performance metrics
      console.log(
        `Pagination query completed in ${duration}ms for ${transformedProducts.length} products (page ${page}, limit ${limit})`,
      );

      return {
        data: transformedProducts,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.error(`Pagination query failed after ${duration}ms:`, error);
      throw error;
    }
  }
}
