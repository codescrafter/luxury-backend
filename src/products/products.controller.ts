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
import { CreateUnavailabilityDto } from './dto/create-unavailability.dto';
import { CreateBookingDto } from './dto/booking.dto';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private catchResponse(action: string, error: any) {
    const status =
      error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(
      {
        success: false,
        message: `Failed to ${action}`,
        error: error.message,
      },
      status,
    );
  }

  // ----- UNIFIED PRODUCTS ENDPOINT -----
  /**
   * Get products with filtering. If no startDate/endDate are provided, defaults to today + next 6 days.
   */
  @Get()
  async getProducts() {
    try {
      const result = await this.productsService.getProducts();
      return { success: true, data:result };
    } catch (error) {
      this.catchResponse('get products', error);
    }
  }

  // ----- Jetski -----
  @Post('jetski')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
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
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateJetski(
    @Param('id') id: string,
    @Body() dto: UpdateJetskiDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateJetSkiHandler(
        id,
        dto,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update jetski', error);
    }
  }

  @Get('jetski/:id')
  @UseGuards(AuthGuard('jwt'))
  async getJetskiById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getJetSkiById(id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get jetski', error);
    }
  }

  // ----- Kayak -----
  @Post('kayak')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
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
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateKayak(
    @Param('id') id: string,
    @Body() dto: UpdateKayakDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateKayakHandler(
        id,
        dto,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update kayak', error);
    }
  }

  @Get('kayak/:id')
  @UseGuards(AuthGuard('jwt'))
  async getKayakById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getKayakById(id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get kayak', error);
    }
  }

  // ----- Yacht -----
  @Post('yacht')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
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
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateYacht(
    @Param('id') id: string,
    @Body() dto: UpdateYachtDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateYachtHandler(
        id,
        dto,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update yacht', error);
    }
  }

  @Get('yacht/:id')
  @UseGuards(AuthGuard())
  async getYachtById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getYachtById(id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get yacht', error);
    }
  }

  // ----- Speedboat -----
  @Post('speedboat')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard(), RolesGuard)
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
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
  async updateSpeedboat(
    @Param('id') id: string,
    @Body() dto: UpdateSpeedboatDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateSpeedboatHandler(
        id,
        dto,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update speedboat', error);
    }
  }

  @Get('speedboat/:id')
  @UseGuards(AuthGuard())
  async getSpeedboatById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getSpeedboatById(id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get speedboat', error);
    }
  }

  // ----- Resort -----
  @Post('resort')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
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
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateResort(
    @Param('id') id: string,
    @Body() dto: UpdateResortDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.updateResortHandler(
        id,
        dto,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('update resort', error);
    }
  }

  @Get('resort/:id')
  @UseGuards(AuthGuard())
  async getResortById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getResortById(id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get resort', error);
    }
  }

  @Get('pending')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllPendingProducts(@Query('showRejected') showRejected: string) {
    try {
      const result = await this.productsService.getAllPendingProducts(showRejected === 'true');
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('get pending products', error);
    }
  }


  

  // --- UNAVAILABILITY ENDPOINTS ---

  /**
   * Partner: Set or update unavailability for a product
   */
  @Post(':id/unavailability')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard(), RolesGuard)
  async setUnavailability(
    @Param('id') productId: string,
    @Body() dto: CreateUnavailabilityDto,
  ) {
    dto.productId = productId;
    const result = await this.productsService.setUnavailability(dto);
    return { success: true, data: result };
  }

  /**
   * User: Get unavailability for a product (for calendar). If no date range is provided, defaults to today + next 6 days.
   */
  @Get(':id/unavailability')
  @UseGuards(AuthGuard())
  async getUnavailability(@Param('id') productId: string, @Query() query: any) {
    const result = await this.productsService.getUnavailability(
      productId,
      query,
    );
    return { success: true, data: result };
  }

  /**
   * Book a product (user API). If date is not provided, defaults to today. startHour/endHour are for non-resort products only.
   */
  @Post(':id/book')
  @UseGuards(AuthGuard())
  async bookProduct(
    @Param('id') productId: string,
    @Body() dto: CreateBookingDto,
    @Req() req,
  ) {
    try {
      dto.productId = productId;
      // productType and date must be provided in body (date defaults to today if not provided)
      if (!dto.date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dto.date = today.toISOString();
      }
      const booking = await this.productsService.bookProduct(dto, req.user);
      return { success: true, data: booking };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // --- BOOKINGS API ---

  /**
   * Get all bookings (admin/partner). If no startDate/endDate are provided, defaults to today + next 6 days. Supports startHour/endHour for per-hour filtering.
   */
  @Get('bookings')
  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllBookings(@Query() query: any) {
    // Default date range if not provided
    if (!query.startDate || !query.endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next6 = new Date(today);
      next6.setDate(today.getDate() + 6);
      query.startDate = today.toISOString();
      query.endDate = next6.toISOString();
    }
    const bookings = await this.productsService.getAllBookings(query);
    return { success: true, data: bookings };
  }

  /**
   * Get bookings for current user. If no startDate/endDate are provided, defaults to today + next 6 days. Supports startHour/endHour for per-hour filtering.
   */
  @Get('my-bookings')
  @UseGuards(AuthGuard())
  async getUserBookings(@Req() req, @Query() query: any) {
    if (!query.startDate || !query.endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next6 = new Date(today);
      next6.setDate(today.getDate() + 6);
      query.startDate = today.toISOString();
      query.endDate = next6.toISOString();
    }
    const bookings = await this.productsService.getUserBookings(
      req.user._id,
      query,
    );
    return { success: true, data: bookings };
  }

  /**
   * Approve a booking (partner/admin)
   */
  @Put('bookings/:id/approve')
  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveBooking(@Param('id') bookingId: string) {
    const booking = await this.productsService.approveBooking(bookingId);
    return { success: true, data: booking };
  }

  /**
   * Reject a booking (partner/admin)
   */
  @Put('bookings/:id/reject')
  @Roles(Role.ADMIN, Role.PARTNER)
  @UseGuards(AuthGuard(), RolesGuard)
  async rejectBooking(@Param('id') bookingId: string) {
    const booking = await this.productsService.rejectBooking(bookingId);
    return { success: true, data: booking };
  }

  /**
   * Approve a product (admin)
   */
  @Put(':type/:id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.approveOrRejectProduct(type, id, 'approve');
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('approve product', error);
    }
  }

  /**
   * Mark a product for revision (admin)
   */
  @Put(':type/:id/revision')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async revisionProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.approveOrRejectProduct(type, id, 'revision');
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('revision product', error);
    }
  }

  /**
   * Reject a product (admin, not shown in pending)
   */
  @Put(':type/:id/reject')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async rejectProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.approveOrRejectProduct(type, id, 'reject');
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('reject product', error);
    }
  }

  /**
   * Resubmit a product (partner)
   */
  @Put(':type/:id/resubmit')
  @Roles(Role.PARTNER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async resubmitProduct(@Param('type') type: string, @Param('id') id: string) {
    try {
      const result = await this.productsService.resubmitProduct(type, id);
      return { success: true, data: result };
    } catch (error) {
      this.catchResponse('resubmit product', error);
    }
  }
}
