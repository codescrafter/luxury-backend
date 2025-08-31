import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
  Param,
  Put,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerMiddleware } from 'src/common/multer.middleware';

import { CreateJetskiDto, UpdateJetskiDto } from './dto/jetski.dto';
import { CreateKayakDto, UpdateKayakDto } from './dto/kayak.dto';
import { CreateYachtDto, UpdateYachtDto } from './dto/yacht.dto';
import { CreateSpeedboatDto, UpdateSpeedboatDto } from './dto/speedboat.dto';
import { CreateResortDto, UpdateResortDto } from './dto/resort.dto';
import { CreateUnavailabilityDto } from './dto/unavailability.dto';
import { CreateBookingDto, UpdatePaymentStatusDto } from './dto/booking.dto';
import { VerifyQrDto } from './dto/booking-qr.dto';
import { DashboardSummaryDto } from './dto/dashboard.dto';

import { ProductsService } from './products.service';
import { Types } from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private catchResponse(action: string, error: any) {
    const status =
      error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    console.error(`❌ Error in ${action}:`, error);
    throw new HttpException(
      {
        success: false,
        message: `Failed to ${action}`,
        error: error.message,
      },
      status,
    );
  }

  @Get() // This is for users and it will show only approved products with filtering
  async getProducts(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    // Filter parameters
    @Query('types') types?: string, // Comma-separated: jetski,kayak,yacht,speedboat,resort
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minCapacity') minCapacity?: number,
    @Query('maxCapacity') maxCapacity?: number,
    @Query('brands') brands?: string, // Comma-separated: Yamaha,Sea Ray
    @Query('cities') cities?: string, // Comma-separated: Dubai,Abu Dhabi
    @Query('yachtTypes') yachtTypes?: string, // Comma-separated: motor,sailing,catamaran
    @Query('resortTypes') resortTypes?: string, // Comma-separated: daily,annual,event
    @Query('starRating') starRating?: number,
    @Query('amenities') amenities?: string, // Comma-separated: WiFi,Parking,Pool
    @Query('tags') tags?: string, // Comma-separated: luxury,family,romantic
    @Query('search') search?: string, // Search in title and description
    @Query('pricingType') pricingType?: string, // perHour, perDay, daily, yearly
    @Query('isDailyResort') isDailyResort?: boolean, // true/false for resorts
    @Query('isAnnualResort') isAnnualResort?: boolean, // true/false for resorts
    @Query('canHostEvent') canHostEvent?: boolean, // true/false for resorts
  ) {
    try {
      const userLang = req.user?.lang || 'en';
      const displayLang = lang || userLang;

      // Parse comma-separated string parameters into arrays
      const parseArrayParam = (param?: string) =>
        param ? param.split(',').map((item) => item.trim()) : undefined;

      // Build filters object
      const filters = {
        types: parseArrayParam(types),
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
        brands: parseArrayParam(brands),
        cities: parseArrayParam(cities),
        yachtTypes: parseArrayParam(yachtTypes),
        resortTypes: parseArrayParam(resortTypes),
        starRating: starRating ? Number(starRating) : undefined,
        amenities: parseArrayParam(amenities),
        tags: parseArrayParam(tags),
        search: search?.trim() || undefined,
        pricingType: pricingType?.trim() || undefined,
        isDailyResort:
          isDailyResort !== undefined ? Boolean(isDailyResort) : undefined,
        isAnnualResort:
          isAnnualResort !== undefined ? Boolean(isAnnualResort) : undefined,
        canHostEvent:
          canHostEvent !== undefined ? Boolean(canHostEvent) : undefined,
      };

      const result =
        await this.productsService.getProductsWithDualLanguageAndFiltering(
          displayLang,
          page,
          limit,
          filters,
        );
      return { success: true, ...result };
    } catch (error) {
      this.catchResponse('get products', error);
    }
  }

  @Get('public') // Public endpoint for getting approved products
  async getPublicProducts(@Query('lang') lang: string = 'en') {
    try {
      const result =
        await this.productsService.getProductsWithDualLanguage(lang);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get public products', error);
    }
  }

  /**
   * Get all pending products (admin: all, partner: own)
   * Returns both languages. Use lang parameter to set default display language.
   * Supports pagination for better performance.
   */
  @Get('pending')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN, Role.PARTNER)
  async getPendingProducts(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    try {
      const isAdmin = req.user.role.includes(Role.ADMIN);
      const isPartner = req.user.role.includes(Role.PARTNER);
      if (!isAdmin && !isPartner) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const ownerId = isPartner && !isAdmin ? req.user._id : undefined;

      // Only use lang parameter if explicitly provided
      // If not provided, return both languages without display fields
      const displayLang = lang || undefined;

      // Use paginated dual-language method for better performance
      const result =
        await this.productsService.getProductsByOwnerAndStatusWithPagination(
          ['pending', 'revision'],
          ownerId,
          displayLang,
          page,
          limit,
        );

      return { success: true, ...result };
    } catch (error) {
      this.catchResponse('get pending products', error);
    }
  }

  /**
   * Get all approved products (admin: all, partner: own)
   * Supports dual-language response with lang parameter and pagination
   */
  @Get('approved')
  @UseGuards(AuthGuard())
  async getApprovedProducts(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    try {
      const isAdmin = req.user.role.includes(Role.ADMIN);
      const isPartner = req.user.role.includes(Role.PARTNER);
      if (!isAdmin && !isPartner) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const ownerId = isPartner ? req.user._id : undefined;
      const userLang = req.user?.lang || 'en';
      const displayLang = lang || userLang;
      const result =
        await this.productsService.getProductsByOwnerAndStatusWithPagination(
          ['approved'],
          ownerId,
          displayLang,
          page,
          limit,
        );
      return { success: true, ...result };
    } catch (error) {
      this.catchResponse('get approved products', error);
    }
  }

  /**
   * Get all rejected products (admin: all, partner: own)
   * Supports dual-language response with lang parameter and pagination
   */
  @Get('rejected')
  @UseGuards(AuthGuard())
  async getRejectedProducts(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    try {
      const isAdmin = req.user.role.includes(Role.ADMIN);
      const isPartner = req.user.role.includes(Role.PARTNER);
      if (!isAdmin && !isPartner) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const ownerId = isPartner ? req.user._id : undefined;
      const userLang = req.user?.lang || 'en';
      const displayLang = lang || userLang;
      const result =
        await this.productsService.getProductsByOwnerAndStatusWithPagination(
          ['rejected'],
          ownerId,
          displayLang,
          page,
          limit,
        );
      return { success: true, ...result };
    } catch (error) {
      this.catchResponse('get rejected products', error);
    }
  }

  // ----- Jetski -----
  @Post('jetski')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async createJetski(
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: CreateJetskiDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.createJetSkiHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('create jetski', error);
    }
  }

  @Put('jetski/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async updateJetski(
    @Param('id') id: string,
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: UpdateJetskiDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateJetSkiHandler(
        id,
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update jetski', error);
    }
  }

  @Get('jetski/:id')
  async getJetskiById(
    @Param('id') id: string,
    @Req() req,
    @Query('lang') lang?: string,
  ) {
    try {
      const userLang = req.user?.lang || 'en';
      const queryLang = lang || userLang;
      const result = await this.productsService.getJetSkiById(id, queryLang);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get jetski', error);
    }
  }

  // ----- Kayak -----
  @Post('kayak')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async createKayak(
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: CreateKayakDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.createKayakHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('create kayak', error);
    }
  }

  @Put('kayak/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async updateKayak(
    @Param('id') id: string,
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: UpdateKayakDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateKayakHandler(
        id,
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update kayak', error);
    }
  }

  @Get('kayak/:id')
  async getKayakById(
    @Param('id') id: string,
    @Req() req,
    @Query('lang') lang?: string,
  ) {
    try {
      const userLang = req.user?.lang || 'en';
      const queryLang = lang || userLang;
      const result = await this.productsService.getKayakById(id, queryLang);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get kayak', error);
    }
  }

  // ----- Yacht -----
  @Post('yacht')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async createYacht(
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: CreateYachtDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.createYachtHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('create yacht', error);
    }
  }

  @Put('yacht/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async updateYacht(
    @Param('id') id: string,
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: UpdateYachtDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateYachtHandler(
        id,
        dto,
        files,
        req.user,
      );

      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update yacht', error);
    }
  }

  @Get('yacht/:id')
  async getYachtById(
    @Param('id') id: string,
    @Req() req,
    @Query('lang') lang?: string,
  ) {
    try {
      const userLang = req.user?.lang || 'en';
      const queryLang = lang || userLang;
      const result = await this.productsService.getYachtById(id, queryLang);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get yacht', error);
    }
  }

  // ----- Speedboat -----
  @Post('speedboat')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async createSpeedboat(
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: CreateSpeedboatDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.createSpeedboatHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('create speedboat', error);
    }
  }

  @Put('speedboat/:id')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async updateSpeedboat(
    @Param('id') id: string,
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: UpdateSpeedboatDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateSpeedboatHandler(
        id,
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update speedboat', error);
    }
  }

  @Get('speedboat/:id')
  async getSpeedboatById(
    @Param('id') id: string,
    @Req() req,
    @Query('lang') lang?: string,
  ) {
    try {
      const userLang = req.user?.lang || 'en';
      const queryLang = lang || userLang;
      const result = await this.productsService.getSpeedboatById(id, queryLang);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get speedboat', error);
    }
  }

  // ----- Resort -----
  @Post('resort')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async createResort(
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: CreateResortDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.createResortHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('create resort', error);
    }
  }

  @Put('resort/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async updateResort(
    @Param('id') id: string,
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: UpdateResortDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateResortHandler(
        id,
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update resort', error);
    }
  }

  @Get('resort/:id')
  async getResortById(
    @Param('id') id: string,
    @Req() req,
    @Query('lang') lang?: string,
  ) {
    try {
      const userLang = req.user?.lang || 'en';
      const queryLang = lang || userLang;
      const result = await this.productsService.getResortById(id, queryLang);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get resort', error);
    }
  }

  /**
   * Approve a product (admin)
   */
  @Put(':type/:id/approve')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async approveProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.approveOrRejectProduct(
        type,
        id,
        'approve',
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('approve product', error);
    }
  }

  /**
   * Mark a product for revision (admin)
   */
  @Put(':type/:id/revision')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async revisionProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.approveOrRejectProduct(
        type,
        id,
        'revision',
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('revision product', error);
    }
  }

  /**
   * Reject a product (admin, not shown in pending)
   */
  @Put(':type/:id/reject')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async rejectProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.approveOrRejectProduct(
        type,
        id,
        'reject',
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('reject product', error);
    }
  }

  /**
   * Resubmit a product (partner)
   */
  @Put(':type/:id/resubmit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async resubmitProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.resubmitProduct(type, id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('resubmit product', error);
    }
  }

  @Post('unavailability')
  async createUnavailability(@Body() dto: CreateUnavailabilityDto) {
    try {
      const created = await this.productsService.createUnavailability(dto);
      return created;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('booking')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER)
  async createBooking(@Body() dto: CreateBookingDto, @Req() req) {
    try {
      // Pass consumerId as a separate argument
      const booking = await this.productsService.createBooking(
        dto,
        req.user._id,
      );
      return { success: true, data: booking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('booking/:id/approve')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.PARTNER)
  async approveBooking(@Param('id') id: string, @Req() req) {
    try {
      const booking = await this.productsService.approveBooking(
        id,
        req.user._id,
      );
      return { success: true, data: booking };
    } catch (error) {
      throw new HttpException(
        error.message || 'Booking not found or unauthorized',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('booking/:id/reject')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.PARTNER)
  async rejectBooking(
    @Param('id') id: string,
    @Req() req,
    @Body('cancellationReason') cancellationReason?: string,
  ) {
    try {
      const booking = await this.productsService.rejectBooking(
        id,
        req.user._id,
        cancellationReason,
      );
      return { success: true, data: booking };
    } catch (error) {
      throw new HttpException(
        error.message || 'Booking not found or unauthorized',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('booking/:id/cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancelBooking(
    @Param('id') id: string,
    @Req() req,
    @Body('reason') reason?: string,
  ) {
    try {
      const booking = await this.productsService.cancelBooking(
        id,
        new Types.ObjectId(req.user._id),
        reason,
      );
      return { success: true, data: booking };
    } catch (error) {
      throw new HttpException(
        error.message || 'Booking not found or unauthorized',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('booking/:id/complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async completeBooking(@Param('id') id: string, @Req() req) {
    try {
      const booking = await this.productsService.completeBooking(
        id,
        req.user._id,
      );
      return { success: true, data: booking };
    } catch (error) {
      throw new HttpException(
        error.message || 'Booking not found or unauthorized',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('consumer/:consumerId/bookings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.USER)
  async getBookingsForConsumer(@Param('consumerId') consumerId: string) {
    try {
      const bookings =
        await this.productsService.getBookingsForConsumer(consumerId);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('partner/:partnerId/bookings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async getBookingsForPartner(@Param('partnerId') partnerId: string) {
    try {
      const bookings =
        await this.productsService.getBookingsForPartner(partnerId);
      return { success: true, data: bookings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get('booking/:id')
  @UseGuards(AuthGuard('jwt'))
  async getBookingById(@Param('id') id: string, @Req() req) {
    try {
      const booking = await this.productsService.getBookingByIdForUserOrPartner(
        id,
        req.user._id,
      );
      return { success: true, data: booking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get related products for "You may like" section
   * Returns similar products based on type, price, capacity, brand, location
   */
  @Get(':type/:productId/related')
  async getRelatedProducts(
    @Param('type') type: string,
    @Param('productId') productId: string,
    @Query('limit') limit: number = 10,
    @Query('lang') lang?: string,
  ) {
    try {
      const result = await this.productsService.getRelatedProducts(
        type,
        productId,
        limit,
        lang,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get related products', error);
    }
  }

  /**
   * Get unavailability for a products
   */
  @Get(':type/:productId/unavailability')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUnavailabilityForProduct(
    @Param('type') type: string,
    @Param('productId') productId: string,
  ) {
    try {
      const result = await this.productsService.getUnavailabilityForProduct(
        type,
        productId,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get unavailability for product', error);
    }
  }

  /**
   * Verify QR code token (public endpoint)
   */
  @Post('qr/verify')
  async verifyQr(@Body() dto: VerifyQrDto) {
    try {
      const result = await this.productsService.verifyQrToken(dto.token);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('verify QR code', error);
    }
  }

  /**
   * Update payment status for a booking (partner only)
   */
  @Put('booking/:id/payment-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updatePaymentStatus(
        id,
        req.user._id,
        dto,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update payment status', error);
    }
  }

  /**
   * Get dashboard summary statistics
   * Works for both admin and partner roles
   */
  @Get('dashboard/summary')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.PARTNER)
  async getDashboardSummary(@Query() dto: DashboardSummaryDto, @Req() req) {
    try {
      const result = await this.productsService.getDashboardSummary(
        req.user._id,
        req.user.role,
        dto,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get dashboard summary', error);
    }
  }
}
