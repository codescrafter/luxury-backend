import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types';
import { BookingQrService } from './booking-qr.service';
import { VerifyQrDto, GenerateQrDto } from './dto/booking-qr.dto';

@Controller('qr')
export class BookingQrController {
  constructor(private readonly bookingQrService: BookingQrService) {}

  /**
   * Generate QR code for a booking
   * Only accessible by the booking owner (consumer) or partner
   */
  @Post('generate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.PARTNER)
  async generateQr(@Body() dto: GenerateQrDto) {
    try {
      const qrRecord = await this.bookingQrService.generateQrForBooking(
        dto.bookingId,
      );
      return {
        success: true,
        data: {
          qrCode: qrRecord,
          qrImageUrl: qrRecord.qrImageUrl,
          token: qrRecord.token,
        },
        message: 'QR code generated successfully',
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to generate QR code',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify QR code token
   * Public endpoint - no authentication required
   */
  @Post('verify')
  async verifyQr(@Body() dto: VerifyQrDto) {
    try {
      const result = await this.bookingQrService.verifyQrToken(dto.token);
      return {
        success: true,
        data: result,
        message: 'QR code verified successfully',
      };
    } catch (error) {
      console.error('Error verifying QR code:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to verify QR code',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get QR code for a booking
   * Only accessible by the booking owner (consumer) or partner
   */
  @Get('booking/:bookingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.PARTNER)
  async getQrForBooking(@Param('bookingId') bookingId: string) {
    try {
      const qrRecord = await this.bookingQrService.getQrForBooking(bookingId);
      return {
        success: true,
        data: {
          qrCode: qrRecord,
          qrImageUrl: qrRecord.qrImageUrl,
          token: qrRecord.token,
        },
        message: 'QR code retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting QR code:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get QR code',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get QR code image directly
   * Only accessible by the booking owner (consumer) or partner
   */
  @Get('booking/:bookingId/image')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.PARTNER)
  async getQrImage(
    @Param('bookingId') bookingId: string,
    @Res() res: Response,
  ) {
    try {
      const qrRecord = await this.bookingQrService.getQrForBooking(bookingId);

      if (!qrRecord.qrImageUrl) {
        throw new HttpException('QR image not found', HttpStatus.NOT_FOUND);
      }

      // Redirect to Cloudinary URL
      res.redirect(qrRecord.qrImageUrl);
    } catch (error) {
      console.error('Error getting QR image:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get QR image',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get QR statistics (admin only)
   */
  @Get('statistics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async getQrStatistics() {
    try {
      const statistics = await this.bookingQrService.getQrStatistics();
      return {
        success: true,
        data: statistics,
        message: 'QR statistics retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting QR statistics:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get QR statistics',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Clean up expired QR codes (admin only)
   */
  @Post('cleanup')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async cleanupExpiredQrCodes() {
    try {
      const cleanedCount = await this.bookingQrService.cleanupExpiredQrCodes();
      return {
        success: true,
        data: { cleanedCount },
        message: `Cleaned up ${cleanedCount} expired QR codes`,
      };
    } catch (error) {
      console.error('Error cleaning up expired QR codes:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to cleanup expired QR codes',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
