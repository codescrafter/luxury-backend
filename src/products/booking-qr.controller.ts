import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Res,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types';
import { BookingQrService } from './booking-qr.service';
import {
  VerifyQrDto,
  GenerateQrDto,
  GetPartnerQrCodesQueryDto,
} from './dto/booking-qr.dto';
import { SecurityGuardAuthGuard } from 'src/auth/guards/security-guard-auth.guard';
import { PRODUCT_CODES } from '../i18n/namespaces/product.namespace';

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
    };
  }

  /**
   * Verify QR code token
   * Only accessible by admin or partner
   */
  @Post('verify')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.PARTNER)
  async verifyQr(@Body() dto: VerifyQrDto) {
    const result = await this.bookingQrService.verifyQrToken(dto.token);
    return { success: true, data: result };
  }

  /**
   * Verify QR code token — Security guard route
   */
  @Post('security-guard/verify')
  @UseGuards(SecurityGuardAuthGuard)
  async verifyQrForSecurityGuard(@Body() dto: VerifyQrDto) {
    const result = await this.bookingQrService.verifyQrToken(dto.token);
    return { success: true, data: result };
  }

  /**
   * Get QR code for a booking
   * Only accessible by the booking owner (consumer) or partner
   */
  @Get('booking/:bookingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.PARTNER)
  async getQrForBooking(@Param('bookingId') bookingId: string) {
    const qrRecord = await this.bookingQrService.getQrForBooking(bookingId);
    return {
      success: true,
      data: {
        qrCode: qrRecord,
        qrImageUrl: qrRecord.qrImageUrl,
        token: qrRecord.token,
      },
    };
  }

  /**
   * Get QR code image directly (redirects to Cloudinary)
   * Only accessible by the booking owner (consumer) or partner
   */
  @Get('booking/:bookingId/image')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER, Role.PARTNER)
  async getQrImage(
    @Param('bookingId') bookingId: string,
    @Res() res: Response,
  ) {
    const qrRecord = await this.bookingQrService.getQrForBooking(bookingId);

    if (!qrRecord.qrImageUrl) {
      throw new NotFoundException(PRODUCT_CODES.QR_NOT_FOUND);
    }

    // Redirect to Cloudinary URL
    res.redirect(qrRecord.qrImageUrl);
  }

  /**
   * Get QR statistics (admin only)
   */
  @Get('statistics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async getQrStatistics() {
    const statistics = await this.bookingQrService.getQrStatistics();
    return { success: true, data: statistics };
  }

  /**
   * Get QR codes for a partner with optional status filter and pagination
   * Only accessible by the partner themselves or admin
   */
  @Get('partner/:partnerId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async getQrCodesForPartner(
    @Param('partnerId') partnerId: string,
    @Query() query: GetPartnerQrCodesQueryDto,
  ): Promise<any> {
    const { status, page = '1', limit = '20' } = query;
    const result = await this.bookingQrService.getQrCodesForPartner(
      partnerId,
      status,
      parseInt(page),
      parseInt(limit),
    );
    return { success: true, data: result };
  }

  /**
   * Get QR codes for the authenticated security guard's partner
   */
  @Get('security-guard')
  @UseGuards(SecurityGuardAuthGuard)
  async getQrCodesForSecurityGuard(
    @Req() req,
    @Query() query: GetPartnerQrCodesQueryDto,
  ): Promise<any> {
    const partnerId = req.user.partnerId;
    const { status, page = '1', limit = '20' } = query;
    const result = await this.bookingQrService.getQrCodesForPartner(
      partnerId,
      status,
      parseInt(page),
      parseInt(limit),
    );
    return { success: true, data: result };
  }

  /**
   * Mark expired QR codes for a partner
   * Only accessible by the partner themselves or admin
   */
  @Post('partner/:partnerId/mark-expired')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async markExpiredQrCodesForPartner(
    @Param('partnerId') partnerId: string,
  ): Promise<any> {
    const result =
      await this.bookingQrService.markExpiredQrCodesForPartner(partnerId);
    return { success: true, data: result };
  }

  /**
   * Clean up expired QR codes (admin only)
   */
  @Post('cleanup')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async cleanupExpiredQrCodes() {
    const cleanedCount = await this.bookingQrService.cleanupExpiredQrCodes();
    return { success: true, data: { cleanedCount } };
  }
}
