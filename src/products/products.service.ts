import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDocument } from 'src/auth/schemas/user-schema';
import { Jetski, JetskiDocument } from './entities/jetski.entity';
import { Kayak, KayakDocument } from './entities/kayak.entity';
import { Yacht, YachtDocument } from './entities/yacht.entity';
import { Speedboat, SpeedboatDocument } from './entities/speedboat.entity';
import { Resort, ResortDocument } from './entities/resort.entity';
import { CreateJetskiDto, UpdateJetskiDto } from './dto/jetski.dto';
import { CreateKayakDto, UpdateKayakDto } from './dto/kayak.dto';
import { CreateYachtDto, UpdateYachtDto } from './dto/yacht.dto';
import { CreateSpeedboatDto, UpdateSpeedboatDto } from './dto/speedboat.dto';
import { CreateResortDto, UpdateResortDto } from './dto/resort.dto';
import { Availability, AvailabilityDocument } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { GetProductsDto, ProductType, SortBy } from './dto/get-products.dto';

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
    @InjectModel(Availability.name)
    private readonly availabilityModel: Model<AvailabilityDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async uploadMedia(
    files: Express.Multer.File[] | undefined,
    folder: string,
  ) {
    if (!files) return [];
    return Promise.all(
      files.map((file) =>
        (folder.includes('image')
          ? this.cloudinaryService.uploadImage(file, folder)
          : this.cloudinaryService.uploadVideo(file, folder)
        ).then((res) => res.secure_url),
      ),
    );
  }



  async createJetSkiHandler(
    dto: CreateJetskiDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadMedia(files.images, 'product-images');
    const videos = await this.uploadMedia(files.videos, 'product-videos');
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
    user: UserDocument,
  ) {
    return this.jetSkiModel.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      dto,
      { new: true },
    );
  }



  async getJetSkiById(id: string) {
    return this.jetSkiModel.findById(id);
  }

  async approveJetSkiHandler(id: string) {
    return this.jetSkiModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }

  async createKayakHandler(
    dto: CreateKayakDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadMedia(files.images, 'product-images');
    const videos = await this.uploadMedia(files.videos, 'product-videos');
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
    user: UserDocument,
  ) {
    return this.kayakModel.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      dto,
      { new: true },
    );
  }



  async getKayakById(id: string) {
    return this.kayakModel.findById(id);
  }

  async approveKayakHandler(id: string) {
    return this.kayakModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }

  async createYachtHandler(
    dto: CreateYachtDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadMedia(files.images, 'product-images');
    const videos = await this.uploadMedia(files.videos, 'product-videos');
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
    user: UserDocument,
  ) {
    return this.yachtModel.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      dto,
      { new: true },
    );
  }



  async getYachtById(id: string) {
    return this.yachtModel.findById(id);
  }

  async approveYachtHandler(id: string) {
    return this.yachtModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }

  async createSpeedboatHandler(
    dto: CreateSpeedboatDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadMedia(files.images, 'product-images');
    const videos = await this.uploadMedia(files.videos, 'product-videos');
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
    user: UserDocument,
  ) {
    return this.speedboatModel.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      dto,
      { new: true },
    );
  }



  async getSpeedboatById(id: string) {
    return this.speedboatModel.findById(id);
  }

  async approveSpeedboatHandler(id: string) {
    return this.speedboatModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }

  async createResortHandler(
    dto: CreateResortDto,
    files: any,
    user: UserDocument,
  ) {
    const images = await this.uploadMedia(files.images, 'product-images');
    const videos = await this.uploadMedia(files.videos, 'product-videos');
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
    user: UserDocument,
  ) {
    return this.resortModel.findOneAndUpdate(
      { _id: id, ownerId: user._id },
      dto,
      { new: true },
    );
  }



  async getResortById(id: string) {
    return this.resortModel.findById(id);
  }

  async approveResortHandler(id: string) {
    return this.resortModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }

  async getAllPendingProducts() {
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: 'pending' }),
      this.kayakModel.find({ status: 'pending' }),
      this.yachtModel.find({ status: 'pending' }),
      this.speedboatModel.find({ status: 'pending' }),
      this.resortModel.find({ status: 'pending' }),
    ]);
    return { jetskis, kayaks, yachts, speedboats, resorts };
  }

  // --- AVAILABILITY METHODS ---

  /**
   * Create or update availability for a product (per day)
   */
  async setAvailability(dto: CreateAvailabilityDto) {
    // Upsert: update if exists, else create
    return this.availabilityModel.findOneAndUpdate(
      {
        productId: dto.productId,
        date: new Date(dto.date),
      },
      {
        $set: {
          status: dto.status,
        },
      },
      { upsert: true, new: true }
    );
  }

  /**
   * Get availability for a product (for calendar display)
   */
  async getAvailability(productId: string) {
    return this.availabilityModel.find({
      productId,
    }).sort({ date: 1 });
  }



  /**
   * Unified method to get products with comprehensive filtering
   */
  async getProducts(filters: GetProductsDto) {
    const {
      productType = ProductType.ALL,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = SortBy.CREATED_AT,
      ...otherFilters
    } = filters;

    // Build base query
    const baseQuery = this.buildAdvancedFilterQuery(otherFilters);
    
    // Handle date range filtering for availability
    let unavailableProductIds: string[] = [];
    if (startDate && endDate) {
      unavailableProductIds = await this.getUnavailableProductIds(startDate, endDate);
    }

    // Get products based on type
    let products: any[] = [];
    let totalCount = 0;

    if (productType === ProductType.ALL) {
      // Get all product types
      const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
        this.getProductsByType('jetski', baseQuery, unavailableProductIds, sortBy),
        this.getProductsByType('kayak', baseQuery, unavailableProductIds, sortBy),
        this.getProductsByType('yacht', baseQuery, unavailableProductIds, sortBy),
        this.getProductsByType('speedboat', baseQuery, unavailableProductIds, sortBy),
        this.getProductsByType('resort', baseQuery, unavailableProductIds, sortBy),
      ]);

      // Combine and sort all products
      products = [...jetskis, ...kayaks, ...yachts, ...speedboats, ...resorts];
      totalCount = products.length;
      
      // Sort combined results
      products = this.sortProducts(products, sortBy);
    } else {
      // Get specific product type
      const result = await this.getProductsByType(productType, baseQuery, unavailableProductIds, sortBy);
      products = result;
      totalCount = result.length;
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedProducts = products.slice(skip, skip + limit);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
      filters: {
        productType,
        startDate,
        endDate,
        ...otherFilters,
      },
    };
  }

  /**
   * Build advanced filter query with all available filters
   */
  private buildAdvancedFilterQuery(filters: any) {
    const query: any = {};

    // Location filters
    if (filters.city) query.city = { $regex: filters.city, $options: 'i' };
    if (filters.region) query.region = { $regex: filters.region, $options: 'i' };
    if (filters.country) query.country = { $regex: filters.country, $options: 'i' };

    // Capacity filter
    if (filters.numberOfPeople) query.capacity = { $gte: +filters.numberOfPeople };

    // Price filters
    if (filters.minPrice || filters.maxPrice) {
      query.$or = [
        { pricePerHour: { $gte: filters.minPrice || 0, $lte: filters.maxPrice || Number.MAX_SAFE_INTEGER } },
        { pricePerDay: { $gte: filters.minPrice || 0, $lte: filters.maxPrice || Number.MAX_SAFE_INTEGER } },
      ];
    }

    // Security deposit filter
    if (filters.maxSecurityDeposit) query.securityDeposit = { $lte: filters.maxSecurityDeposit };

    // Rating and review filters
    if (filters.minRating) query.averageRating = { $gte: filters.minRating };
    if (filters.minReviewCount) query.reviewCount = { $gte: filters.minReviewCount };

    // Product-specific filters
    if (filters.brand) query.brand = { $regex: filters.brand, $options: 'i' };
    if (filters.engineType) query.engineType = { $regex: filters.engineType, $options: 'i' };
    if (filters.minEnginePower) query.enginePower = { $regex: new RegExp(`\\d+cc.*${filters.minEnginePower}`, 'i') };
    if (filters.maxSpeed) query.maxSpeed = { $lte: filters.maxSpeed };
    if (filters.color) query.color = { $regex: filters.color, $options: 'i' };
    if (filters.modelYear) query.modelYear = filters.modelYear;

    // Boolean filters
    if (filters.fuelIncluded !== undefined) query.fuelIncluded = filters.fuelIncluded;
    if (filters.insuranceIncluded !== undefined) query.insuranceIncluded = filters.insuranceIncluded;
    if (filters.licenseRequired !== undefined) query.licenseRequired = filters.licenseRequired;
    if (filters.lifeJacketsIncluded !== undefined) query.lifeJacketsIncluded = filters.lifeJacketsIncluded;
    if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
    if (filters.isRental !== undefined) query.isRental = filters.isRental;
    if (filters.isEventProperty !== undefined) query.isEventProperty = filters.isEventProperty;

    // Status filter
    if (filters.status) query.status = filters.status;
    else query.status = 'approved'; // Default to approved products only

    // Owner filter
    if (filters.ownerId) query.ownerId = filters.ownerId;

    // Search filter
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { brand: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags.map(tag => new RegExp(tag, 'i')) };
    }

    return query;
  }

  /**
   * Get products by specific type with filters
   */
  private async getProductsByType(type: string, baseQuery: any, unavailableProductIds: string[], sortBy: SortBy) {
    let model;
    switch (type) {
      case 'jetski': model = this.jetSkiModel; break;
      case 'kayak': model = this.kayakModel; break;
      case 'yacht': model = this.yachtModel; break;
      case 'speedboat': model = this.speedboatModel; break;
      case 'resort': model = this.resortModel; break;
      default: throw new Error('Invalid product type');
    }

    const query = {
      ...baseQuery,
      ...(unavailableProductIds.length > 0 && { _id: { $nin: unavailableProductIds } }),
    };

    const sortOptions = this.getSortOptions(sortBy);
    return model.find(query).sort(sortOptions).lean();
  }

  /**
   * Get unavailable product IDs for date range
   */
  private async getUnavailableProductIds(startDate: string, endDate: string): Promise<string[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const availabilities = await this.availabilityModel.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: { $in: ['unavailable', 'booked'] },
        }
      },
      {
        $group: {
          _id: '$productId',
          unavailableDates: { $addToSet: '$date' },
        }
      },
    ]);

    return availabilities.map(a => a._id.toString());
  }

  /**
   * Get sort options for different sort types
   */
  private getSortOptions(sortBy: SortBy) {
    switch (sortBy) {
      case SortBy.PRICE_LOW_TO_HIGH:
        return { pricePerDay: 1, pricePerHour: 1 };
      case SortBy.PRICE_HIGH_TO_LOW:
        return { pricePerDay: -1, pricePerHour: -1 };
      case SortBy.RATING:
        return { averageRating: -1, reviewCount: -1 };
      case SortBy.REVIEWS:
        return { reviewCount: -1, averageRating: -1 };
      case SortBy.BOOKINGS:
        return { totalBookings: -1 };
      case SortBy.FEATURED:
        return { isFeatured: -1, createdAt: -1 };
      case SortBy.CREATED_AT:
      default:
        return { createdAt: -1 };
    }
  }

  /**
   * Sort products array (for combined results)
   */
  private sortProducts(products: any[], sortBy: SortBy) {
    return products.sort((a, b) => {
      switch (sortBy) {
        case SortBy.PRICE_LOW_TO_HIGH:
          return (a.pricePerDay || a.pricePerHour || 0) - (b.pricePerDay || b.pricePerHour || 0);
        case SortBy.PRICE_HIGH_TO_LOW:
          return (b.pricePerDay || b.pricePerHour || 0) - (a.pricePerDay || a.pricePerHour || 0);
        case SortBy.RATING:
          return (b.averageRating || 0) - (a.averageRating || 0);
        case SortBy.REVIEWS:
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case SortBy.BOOKINGS:
          return (b.totalBookings || 0) - (a.totalBookings || 0);
        case SortBy.FEATURED:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case SortBy.CREATED_AT:
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }
}
