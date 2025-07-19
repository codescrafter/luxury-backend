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
import { CreateJetskiDto, UpdateJetskiDto } from './dto/jetski.dto';
import { CreateKayakDto, UpdateKayakDto } from './dto/kayak.dto';
import { CreateYachtDto, UpdateYachtDto } from './dto/yacht.dto';
import { CreateSpeedboatDto, UpdateSpeedboatDto } from './dto/speedboat.dto';
import { CreateResortDto, UpdateResortDto } from './dto/resort.dto';
import { CreateUnavailabilityDto } from './dto/unavailability.dto';
import { CreateBookingDto } from './dto/booking.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
const mongoose = require('mongoose');
// All booking and unavailability related methods and usages have been removed.

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

  private async uploadMedia(files: any[] | undefined, folder: string) {
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

  /**
   * Get all approved products from all models
   */
  async getProducts() {
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: 'approved' }),
      this.kayakModel.find({ status: 'approved' }),
      this.yachtModel.find({ status: 'approved' }),
      this.speedboatModel.find({ status: 'approved' }),
      this.resortModel.find({ status: 'approved' }),
    ]);
    return [...jetskis, ...kayaks, ...yachts, ...speedboats, ...resorts];
  }

  async getProductsByOwnerAndStatus(statuses: string[], ownerId?: string) {
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
        ? this.jetSkiModel.find(filter).populate('ownerId')
        : this.jetSkiModel.find(filter),
      populateOwner
        ? this.kayakModel.find(filter).populate('ownerId')
        : this.kayakModel.find(filter),
      populateOwner
        ? this.yachtModel.find(filter).populate('ownerId')
        : this.yachtModel.find(filter),
      populateOwner
        ? this.speedboatModel.find(filter).populate('ownerId')
        : this.speedboatModel.find(filter),
      populateOwner
        ? this.resortModel.find(filter).populate('ownerId')
        : this.resortModel.find(filter),
    ]);

    return [...jetskis, ...kayaks, ...yachts, ...speedboats, ...resorts];
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
    // 3. Validate price (fetch product and compare expected price)
    let product: any;
    let partnerId: Types.ObjectId;
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
    partnerId = product.ownerId;
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
      partnerId,
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

  getModelBasedOnProductType(productType: string) {
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
          // @ts-ignore
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
          // @ts-ignore
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
}
