import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import {
  BookingQr,
  BookingQrDocument,
  QrStatus,
} from './entities/booking-qr.entity';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from './entities/booking.entity';
import { Jetski, JetskiDocument } from './entities/jetski.entity';
import { Kayak, KayakDocument } from './entities/kayak.entity';
import { Yacht, YachtDocument } from './entities/yacht.entity';
import { Speedboat, SpeedboatDocument } from './entities/speedboat.entity';
import { Resort, ResortDocument } from './entities/resort.entity';
import { PRODUCT_CODES } from '../i18n/namespaces/product.namespace';

@Injectable()
export class BookingQrService {
  constructor(
    @InjectModel(BookingQr.name)
    private readonly bookingQrModel: Model<BookingQrDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Jetski.name)
    private readonly jetSkiModel: Model<JetskiDocument>,
    @InjectModel(Kayak.name)
    private readonly kayakModel: Model<KayakDocument>,
    @InjectModel(Yacht.name)
    private readonly yachtModel: Model<YachtDocument>,
    @InjectModel(Speedboat.name)
    private readonly speedboatModel: Model<SpeedboatDocument>,
    @InjectModel(Resort.name)
    private readonly resortModel: Model<ResortDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Generate a unique token for QR code
   */
  private generateToken(): string {
    return uuidv4();
  }

  /**
   * Generate QR code image and upload to Cloudinary
   */
  private async generateQrImage(token: string): Promise<string> {
    try {
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(token, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 300,
      });

      // Convert data URL to buffer
      const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Create a file-like object for Cloudinary
      const file = {
        buffer,
        originalname: `qr-${token}.png`,
        mimetype: 'image/png',
      };

      // Upload to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'booking-qr-codes',
      );

      return uploadResult.secure_url;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new InternalServerErrorException(PRODUCT_CODES.QR_GENERATE_FAILED);
    }
  }

  /**
   * Get product model based on product type
   */
  private getProductModel(productType: string): Model<any> {
    switch (productType) {
      case 'jetski':
        return this.jetSkiModel;
      case 'kayak':
        return this.kayakModel;
      case 'yacht':
        return this.yachtModel;
      case 'speedboat':
        return this.speedboatModel;
      case 'resort':
        return this.resortModel;
      default:
        throw new BadRequestException(PRODUCT_CODES.INVALID_TYPE);
    }
  }

  /**
   * Generate QR code for a confirmed booking
   */
  async generateQrForBooking(bookingId: string): Promise<BookingQr> {
    try {
      // Find the booking
      const booking = await this.bookingModel.findById(bookingId);
      if (!booking) {
        throw new NotFoundException(PRODUCT_CODES.BOOKING_NOT_FOUND);
      }

      // Check if booking is confirmed
      if (booking.bookingStatus !== BookingStatus.CONFIRMED) {
        throw new BadRequestException(PRODUCT_CODES.QR_NOT_FOR_CONFIRMED);
      }

      // Check if QR already exists for this booking
      const existingQr = await this.bookingQrModel.findOne({
        bookingId: new Types.ObjectId(bookingId),
        status: QrStatus.ACTIVE,
      });

      if (existingQr) {
        throw new ConflictException(PRODUCT_CODES.QR_ALREADY_EXISTS);
      }

      // Generate unique token
      const token = this.generateToken();

      // Generate QR image and upload to Cloudinary
      const qrImageUrl = await this.generateQrImage(token);

      // Create QR record
      const qrRecord = new this.bookingQrModel({
        bookingId: new Types.ObjectId(bookingId),
        userId: booking.consumerId,
        productId: booking.productId,
        productType: booking.productType,
        startTime: booking.startTime,
        endTime: booking.endTime,
        token,
        status: QrStatus.ACTIVE,
        expiresAt: booking.endTime, // QR expires when booking ends
        qrImageUrl,
      });

      return await qrRecord.save();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error generating QR for booking:', error);
      throw new InternalServerErrorException(PRODUCT_CODES.QR_GENERATE_FAILED);
    }
  }

  /**
   * Verify QR code token
   */
  async verifyQrToken(token: string): Promise<any> {
    try {
      // Find QR record by token
      const qrRecord = await this.bookingQrModel.findOne({ token });
      if (!qrRecord) {
        throw new NotFoundException(PRODUCT_CODES.QR_INVALID);
      }

      // Check if QR is active
      if (qrRecord.status !== QrStatus.ACTIVE) {
        if (qrRecord.status === QrStatus.REDEEMED) {
          throw new BadRequestException(PRODUCT_CODES.QR_ALREADY_USED);
        } else if (qrRecord.status === QrStatus.EXPIRED) {
          throw new BadRequestException(PRODUCT_CODES.QR_EXPIRED);
        }
      }

      // Check if QR has expired
      const now = new Date();
      if (now > qrRecord.expiresAt) {
        // Mark as expired
        await this.bookingQrModel.findByIdAndUpdate(qrRecord._id, {
          status: QrStatus.EXPIRED,
        });
        throw new BadRequestException(PRODUCT_CODES.QR_EXPIRED);
      }

      // Get booking details
      const booking = await this.bookingModel.findById(qrRecord.bookingId);
      if (!booking) {
        throw new NotFoundException(PRODUCT_CODES.BOOKING_NOT_FOUND);
      }

      // Get user details
      const user = await this.bookingModel
        .findById(qrRecord.bookingId)
        .populate('consumerId')
        .then((booking) => booking?.consumerId);

      // Get product details
      const productModel = this.getProductModel(qrRecord.productType);
      const product = await productModel.findById(qrRecord.productId);

      // Mark QR as redeemed
      await this.bookingQrModel.findByIdAndUpdate(qrRecord._id, {
        status: QrStatus.REDEEMED,
        redeemedAt: now,
      });

      return {
        booking,
        user,
        product,
        qrDetails: {
          token: qrRecord.token,
          status: QrStatus.REDEEMED,
          redeemedAt: now,
          startTime: qrRecord.startTime,
          endTime: qrRecord.endTime,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error verifying QR token:', error);
      throw new InternalServerErrorException(PRODUCT_CODES.QR_VERIFY_FAILED);
    }
  }

  /**
   * Get QR code for a booking
   */
  async getQrForBooking(bookingId: string): Promise<BookingQr> {
    const qrRecord = await this.bookingQrModel.findOne({
      bookingId: new Types.ObjectId(bookingId),
      status: QrStatus.ACTIVE,
    });

    if (qrRecord) {
      return qrRecord;
    }

    // Lazy generate QR code if booking is confirmed but QR is missing
    const booking = await this.bookingModel.findById(bookingId);
    if (booking && booking.bookingStatus === BookingStatus.CONFIRMED) {
      try {
        return await this.generateQrForBooking(bookingId);
      } catch (error) {
        console.error('Lazy QR generation failed:', error);
      }
    }

    throw new NotFoundException(PRODUCT_CODES.QR_NOT_FOUND);
  }

  /**
   * Remove QR code for a booking (mark as expired)
   */
  async removeQrForBooking(bookingId: string): Promise<boolean> {
    const result = await this.bookingQrModel.updateMany(
      {
        bookingId: new Types.ObjectId(bookingId),
        status: QrStatus.ACTIVE,
      },
      {
        status: QrStatus.EXPIRED,
      },
    );

    return result.modifiedCount > 0;
  }

  /**
   * Clean up expired QR codes (can be called by a cron job)
   */
  async cleanupExpiredQrCodes(): Promise<number> {
    const now = new Date();
    const result = await this.bookingQrModel.updateMany(
      {
        expiresAt: { $lt: now },
        status: QrStatus.ACTIVE,
      },
      {
        status: QrStatus.EXPIRED,
      },
    );

    return result.modifiedCount;
  }

  /**
   * Get QR codes for a partner with optional status filter and pagination
   */
  async getQrCodesForPartner(
    partnerId: string,
    status?: QrStatus,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      // Build filter criteria
      const filter: any = {};

      // Get all bookings for this partner first
      const partnerBookings = await this.bookingModel
        .find({ partnerId: new Types.ObjectId(partnerId) })
        .select('_id')
        .lean();

      const bookingIds = partnerBookings.map((booking) => booking._id);

      if (bookingIds.length === 0) {
        return {
          qrCodes: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      // Filter by booking IDs (which belong to the partner)
      filter.bookingId = { $in: bookingIds };

      // Add status filter if provided
      if (status) {
        filter.status = status;
      }

      // Get total count for pagination
      const totalCount = await this.bookingQrModel.countDocuments(filter);

      // Get paginated QR codes with populated data
      const qrCodes = await this.bookingQrModel
        .find(filter)
        .populate('bookingId')
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Populate product data for each QR code
      const populatedQrCodes = await Promise.all(
        qrCodes.map(async (qrCode) => {
          const model = this.getProductModel(qrCode.productType);
          const product = await model.findById(qrCode.productId).lean();

          return {
            ...qrCode,
            product,
          };
        }),
      );

      return {
        qrCodes: populatedQrCodes,
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
      console.error('Error getting QR codes for partner:', error);
      throw new InternalServerErrorException(PRODUCT_CODES.QR_FETCH_FAILED);
    }
  }

  /**
   * Mark expired QR codes for a specific partner
   * This method finds QR codes that have passed their endTime and marks them as expired
   */
  async markExpiredQrCodesForPartner(partnerId: string): Promise<{
    expiredCount: number;
    messageCode: string;
  }> {
    try {
      const now = new Date();

      // Get all bookings for this partner first
      const partnerBookings = await this.bookingModel
        .find({ partnerId: new Types.ObjectId(partnerId) })
        .select('_id')
        .lean();

      const bookingIds = partnerBookings.map((booking) => booking._id);

      if (bookingIds.length === 0) {
        return {
          expiredCount: 0,
          messageCode: PRODUCT_CODES.QR_NO_BOOKINGS_FOUND,
        };
      }

      // Find QR codes that belong to this partner's bookings and have passed their endTime
      const result = await this.bookingQrModel.updateMany(
        {
          bookingId: { $in: bookingIds },
          status: QrStatus.ACTIVE,
          endTime: { $lt: now }, // QR codes where endTime has passed
        },
        {
          status: QrStatus.EXPIRED,
        },
      );

      return {
        expiredCount: result.modifiedCount,
        messageCode: PRODUCT_CODES.QR_MARKED_EXPIRED,
      };
    } catch (error) {
      console.error('Error marking expired QR codes for partner:', error);
      throw new InternalServerErrorException(PRODUCT_CODES.QR_FETCH_FAILED);
    }
  }

  /**
   * Get QR statistics
   */
  async getQrStatistics() {
    const [active, redeemed, expired] = await Promise.all([
      this.bookingQrModel.countDocuments({ status: QrStatus.ACTIVE }),
      this.bookingQrModel.countDocuments({ status: QrStatus.REDEEMED }),
      this.bookingQrModel.countDocuments({ status: QrStatus.EXPIRED }),
    ]);

    return {
      active,
      redeemed,
      expired,
      total: active + redeemed + expired,
    };
  }
}
