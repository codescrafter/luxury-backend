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
import {
  Unavailability,
  UnavailabilityDocument,
} from './entities/unavailability.entity';
import { CreateUnavailabilityDto } from './dto/create-unavailability.dto';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from './entities/booking.entity';
import { CreateBookingDto, BookingProductType } from './dto/booking.dto';

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
    private readonly unavailabilityModel: Model<UnavailabilityDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
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

  async getAllPendingProducts(showRejected = false) {
    const statusFilter = showRejected ? ['pending', 'revision', 'rejected'] : ['pending', 'revision'];
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: { $in: statusFilter } }),
      this.kayakModel.find({ status: { $in: statusFilter } }),
      this.yachtModel.find({ status: { $in: statusFilter } }),
      this.speedboatModel.find({ status: { $in: statusFilter } }),
      this.resortModel.find({ status: { $in: statusFilter } }),
    ]);
    return { jetskis, kayaks, yachts, speedboats, resorts };
  }

  // --- UNAVAILABILITY METHODS ---

  /**
   * Create or update unavailability for a product (per day)
   */
  async setUnavailability(dto: CreateUnavailabilityDto) {
    // Resort: only allow full-day unavailability
    // Others: allow per-hour unavailability, prevent overlap
    const { productId, date, startHour, endHour } = dto;
    const product = await this.getProductById(productId);
    const isResort = product && product.type === 'resort';
    if (isResort) {
      // Only allow full-day
      const conflict = await this.unavailabilityModel.findOne({
        productId,
        date: new Date(date),
      });
      if (conflict)
        throw new Error('Resort is already unavailable for this date');
      return this.unavailabilityModel.create({
        productId,
        date: new Date(date),
      });
    } else {
      // Per-hour unavailability
      if (typeof startHour !== 'number' || typeof endHour !== 'number') {
        throw new Error(
          'startHour and endHour are required for hourly unavailability',
        );
      }
      if (startHour < 0 || endHour > 24 || startHour >= endHour) {
        throw new Error('Invalid unavailability hours');
      }
      // Prevent overlap
      const conflict = await this.unavailabilityModel.findOne({
        productId,
        date: new Date(date),
        $or: [{ startHour: { $lt: endHour }, endHour: { $gt: startHour } }],
      });
      if (conflict)
        throw new Error('Product is already unavailable for this time slot');
      return this.unavailabilityModel.create({
        productId,
        date: new Date(date),
        startHour,
        endHour,
      });
    }
  }

  // Helper to get product by id and type
  private async getProductById(productId: string) {
    // Try all models
    let product = await this.jetSkiModel.findById(productId);
    if (product) return product;
    product = await this.kayakModel.findById(productId);
    if (product) return product;
    product = await this.yachtModel.findById(productId);
    if (product) return product;
    product = await this.speedboatModel.findById(productId);
    if (product) return product;
    product = await this.resortModel.findById(productId);
    if (product) return product;
    return null;
  }

  /**
   * Get unavailability for a product (for calendar display)
   */
  async getUnavailability(productId: string, query: any = {}) {
    // Accept startDate/endDate/startHour/endHour for filtering
    let { startDate, endDate, startHour, endHour } = query;
    if (!startDate || !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next6 = new Date(today);
      next6.setDate(today.getDate() + 6);
      startDate = today.toISOString();
      endDate = next6.toISOString();
    }
    const dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const findQuery: any = { productId, date: dateFilter };
    if (typeof startHour === 'number' && typeof endHour === 'number') {
      findQuery.startHour = { $lt: endHour };
      findQuery.endHour = { $gt: startHour };
    }
    return this.unavailabilityModel.find(findQuery).sort({ date: 1 });
  }

  /**
   * Unified method to get products with comprehensive filtering
   */
  async getProducts() {
    // get all approved products from all models
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: 'approved' }),
      this.kayakModel.find({ status: 'approved' }),
      this.yachtModel.find({ status: 'approved' }),
      this.speedboatModel.find({ status: 'approved' }),
      this.resortModel.find({ status: 'approved' }),
    ]);
    return [ ...jetskis, ...kayaks, ...yachts, ...speedboats, ...resorts ];
  }

  /**
   * Get unavailable product IDs for date range
   */
  private async getUnavailableProductIds(
    startDate: string,
    endDate: string,
    productType?: string,
    filters?: any,
  ): Promise<string[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let availabilities = [];
    if (productType === 'resort') {
      // Resort: only date
      availabilities = await this.unavailabilityModel.aggregate([
        {
          $match: {
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: '$productId',
            unavailableDates: { $addToSet: '$date' },
          },
        },
      ]);
    } else {
      // Per-hour: check for overlap
      const { startHour, endHour } = filters || {};
      if (typeof startHour !== 'number' || typeof endHour !== 'number')
        return [];
      availabilities = await this.unavailabilityModel.aggregate([
        {
          $match: {
            date: { $gte: start, $lte: end },
            startHour: { $lt: endHour },
            endHour: { $gt: startHour },
          },
        },
        {
          $group: {
            _id: '$productId',
            unavailableDates: { $addToSet: '$date' },
          },
        },
      ]);
    }
    return availabilities.map((a) => a._id.toString());
  }

  /**
   * Book a product (user API)
   */
  async bookProduct(dto: CreateBookingDto, user: UserDocument) {
    // Check for overlapping bookings
    const { productId, productType, date, startHour, endHour } = dto;
    const bookingDate = new Date(date);
    let conflict;
    if (productType === BookingProductType.RESORT) {
      // Resort: only one booking per day
      conflict = await this.bookingModel.findOne({
        productId,
        productType,
        date: bookingDate,
        status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      });
      if (conflict) throw new Error('Resort is already booked for this date');
    } else {
      // Per-hour: check for overlapping time slots
      if (typeof startHour !== 'number' || typeof endHour !== 'number') {
        throw new Error(
          'startHour and endHour are required for per-hour bookings',
        );
      }
      if (startHour < 0 || endHour > 24 || startHour >= endHour) {
        throw new Error('Invalid booking hours');
      }
      conflict = await this.bookingModel.findOne({
        productId,
        productType,
        date: bookingDate,
        status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        $or: [
          { startHour: { $lt: endHour }, endHour: { $gt: startHour } }, // overlap
        ],
      });
      if (conflict)
        throw new Error('Product is already booked for this time slot');
    }
    // Create booking
    const booking = await this.bookingModel.create({
      userId: user._id,
      productId,
      productType,
      date: bookingDate,
      startHour:
        productType === BookingProductType.RESORT ? undefined : startHour,
      endHour: productType === BookingProductType.RESORT ? undefined : endHour,
      status: BookingStatus.PENDING,
    });
    return booking;
  }

  /**
   * Get all bookings (admin/partner)
   */
  async getAllBookings(query: any = {}) {
    // Accept startDate/endDate/startHour/endHour for filtering
    let { startDate, endDate, startHour, endHour } = query;
    if (!startDate || !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next6 = new Date(today);
      next6.setDate(today.getDate() + 6);
      startDate = today.toISOString();
      endDate = next6.toISOString();
    }
    const dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const findQuery: any = { date: dateFilter };
    if (typeof startHour === 'number' && typeof endHour === 'number') {
      findQuery.startHour = { $lt: endHour };
      findQuery.endHour = { $gt: startHour };
    }
    return this.bookingModel
      .find(findQuery)
      .populate('userId')
      .populate('productId')
      .sort({ createdAt: -1 });
  }

  /**
   * Get bookings for a user
   */
  async getUserBookings(userId: string, query: any = {}) {
    // Accept startDate/endDate/startHour/endHour for filtering
    let { startDate, endDate, startHour, endHour } = query;
    if (!startDate || !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next6 = new Date(today);
      next6.setDate(today.getDate() + 6);
      startDate = today.toISOString();
      endDate = next6.toISOString();
    }
    const dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const findQuery: any = { userId, date: dateFilter };
    if (typeof startHour === 'number' && typeof endHour === 'number') {
      findQuery.startHour = { $lt: endHour };
      findQuery.endHour = { $gt: startHour };
    }
    return this.bookingModel
      .find(findQuery)
      .populate('productId')
      .sort({ createdAt: -1 });
  }

  /**
   * Approve a booking (partner/admin)
   */
  async approveBooking(bookingId: string) {
    return this.bookingModel.findByIdAndUpdate(
      bookingId,
      { status: BookingStatus.CONFIRMED },
      { new: true },
    );
  }

  /**
   * Reject a booking (partner/admin)
   */
  async rejectBooking(bookingId: string) {
    return this.bookingModel.findByIdAndUpdate(
      bookingId,
      { status: BookingStatus.CANCELLED },
      { new: true },
    );
  }

 // In the approveOrRejectProduct method, change this:
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
}
