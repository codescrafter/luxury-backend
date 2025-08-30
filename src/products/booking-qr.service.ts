import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      throw new HttpException(
        'Failed to generate QR code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        throw new HttpException('Invalid product type', HttpStatus.BAD_REQUEST);
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
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
      }

      // Check if booking is confirmed
      if (booking.bookingStatus !== BookingStatus.CONFIRMED) {
        throw new HttpException(
          'QR code can only be generated for confirmed bookings',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if QR already exists for this booking
      const existingQr = await this.bookingQrModel.findOne({
        bookingId: new Types.ObjectId(bookingId),
        status: QrStatus.ACTIVE,
      });

      if (existingQr) {
        throw new HttpException(
          'QR code already exists for this booking',
          HttpStatus.CONFLICT,
        );
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
      throw new HttpException(
        'Failed to generate QR code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        throw new HttpException('Invalid QR code', HttpStatus.NOT_FOUND);
      }

      // Check if QR is active
      if (qrRecord.status !== QrStatus.ACTIVE) {
        if (qrRecord.status === QrStatus.REDEEMED) {
          throw new HttpException(
            'QR code has already been redeemed',
            HttpStatus.BAD_REQUEST,
          );
        } else if (qrRecord.status === QrStatus.EXPIRED) {
          throw new HttpException(
            'QR code has expired',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Check if QR has expired
      const now = new Date();
      if (now > qrRecord.expiresAt) {
        // Mark as expired
        await this.bookingQrModel.findByIdAndUpdate(qrRecord._id, {
          status: QrStatus.EXPIRED,
        });
        throw new HttpException('QR code has expired', HttpStatus.BAD_REQUEST);
      }

      // Get booking details
      const booking = await this.bookingModel.findById(qrRecord.bookingId);
      if (!booking) {
        throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException(
        'Failed to verify QR code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    if (!qrRecord) {
      throw new HttpException('QR code not found', HttpStatus.NOT_FOUND);
    }

    return qrRecord;
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
