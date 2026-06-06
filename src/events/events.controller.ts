import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types';
import { multerMiddleware } from 'src/common/multer.middleware';
import { EventsService } from './events.service';
import { CreateEventVenueDto } from './dto/create-event-venue.dto';
import { UpdateEventVenueDto } from './dto/update-event-venue.dto';
import { CreateEventVenueRequestDto } from './dto/create-event-venue-request.dto';
import { UpdateEventVenueRequestStatusDto } from './dto/update-event-venue-request-status.dto';
import { EventVenueRequestStatus } from './entities/event-venue-request.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}


  @Get('venues')
  async getPublicVenues(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('city') city?: string,
    @Query('tags') tags?: string,
    @Query('minCapacity') minCapacity?: number,
    @Query('maxCapacity') maxCapacity?: number,
    @Query('isIndoor') isIndoor?: string,
    @Query('isOutdoor') isOutdoor?: string,
    @Query('search') search?: string,
  ) {
    const displayLang = lang || req.user?.lang || 'en';
    const parsedTags = tags
      ? Array.isArray(tags)
        ? tags
        : tags
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
      : undefined;
    const filters = {
      city: city?.trim(),
      tags: parsedTags,
      minCapacity: minCapacity ? Number(minCapacity) : undefined,
      maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
      isIndoor:
        isIndoor !== undefined
          ? ['true', '1', 'yes'].includes(String(isIndoor).toLowerCase())
          : undefined,
      isOutdoor:
        isOutdoor !== undefined
          ? ['true', '1', 'yes'].includes(String(isOutdoor).toLowerCase())
          : undefined,
      search: search?.trim(),
    };

    const result = await this.eventsService.getPublicVenues(
      displayLang,
      Number(page) || 1,
      Number(limit) || 20,
      filters,
    );
    return { success: true, ...result };
  }

  @Post('venues')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async createVenue(
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: CreateEventVenueDto,
    @Req() req,
  ) {
    const venue = await this.eventsService.createVenue(dto, files, req.user);
    return { success: true, data: venue };
  }

  @Put('venues/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
        { name: 'videos', maxCount: 5 },
      ],
      multerMiddleware,
    ),
  )
  async updateVenue(
    @Param('id') id: string,
    @UploadedFiles()
    files: { images?: any[]; videos?: any[] },
    @Body() dto: UpdateEventVenueDto,
    @Req() req,
  ) {
    const venue = await this.eventsService.updateVenue(id, dto, files, req.user);
    return { success: true, data: venue };
  }

  @Get('venues/pending')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.PARTNER)
  async getPendingVenues(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const isAdmin = req.user.role.includes(Role.ADMIN);
    const ownerId = isAdmin ? undefined : req.user._id;
    const displayLang = lang || req.user?.lang || undefined;
    const result = await this.eventsService.getVenuesByStatus(
      ['pending', 'revision'],
      ownerId,
      displayLang,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return { success: true, ...result };
  }

  @Get('venues/approved')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.PARTNER)
  async getApprovedVenues(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const isAdmin = req.user.role.includes(Role.ADMIN);
    const ownerId = isAdmin ? undefined : req.user._id;
    const displayLang = lang || req.user?.lang || undefined;
    const result = await this.eventsService.getVenuesByStatus(
      ['approved'],
      ownerId,
      displayLang,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return { success: true, ...result };
  }

  @Get('venues/rejected')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.PARTNER)
  async getRejectedVenues(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const isAdmin = req.user.role.includes(Role.ADMIN);
    const ownerId = isAdmin ? undefined : req.user._id;
    const displayLang = lang || req.user?.lang || undefined;
    const result = await this.eventsService.getVenuesByStatus(
      ['rejected'],
      ownerId,
      displayLang,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return { success: true, ...result };
  }

  @Put('venues/:id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async approveVenue(@Param('id') id: string) {
    const venue = await this.eventsService.approveVenue(id);
    return { success: true, data: venue };
  }

  @Put('venues/:id/revision')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async markVenueForRevision(@Param('id') id: string) {
    const venue = await this.eventsService.markVenueForRevision(id);
    return { success: true, data: venue };
  }

  @Put('venues/:id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async rejectVenue(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    const venue = await this.eventsService.rejectVenue(id, body?.reason);
    return { success: true, data: venue };
  }

  @Put('venues/:id/resubmit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER, Role.ADMIN)
  async resubmitVenue(@Param('id') id: string, @Req() req) {
    const isAdmin = req.user.role.includes(Role.ADMIN);
    const venue = await this.eventsService.resubmitVenue(id, req.user._id, isAdmin);
    return { success: true, data: venue };
  }

  @Get('venues/mine')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async getPartnerVenues(
    @Req() req,
    @Query('lang') lang?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const displayLang = lang || req.user?.lang || 'en';
    const result = await this.eventsService.getVenuesByStatus(
      ['pending', 'approved', 'revision', 'rejected'],
      req.user._id,
      displayLang,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return { success: true, ...result };
  }

  @Post('venues/:venueId/requests')
  async createVenueRequest(
    @Param('venueId') venueId: string,
    @Body() dto: CreateEventVenueRequestDto,
    @Req() req,
  ) {
    const request = await this.eventsService.createVenueRequest(
      venueId,
      dto,
      req.user,
    );
    return { success: true, data: request };
  }

  @Get('requests')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async getPartnerRequests(
    @Req() req,
    @Query('status') status?: EventVenueRequestStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('lang') lang?: string,
  ) {
    const normalizedStatus =
      status &&
      Object.values(EventVenueRequestStatus).includes(
        status as EventVenueRequestStatus,
      )
        ? (status as EventVenueRequestStatus)
        : undefined;

    const result = await this.eventsService.getPartnerRequests(
      req.user._id,
      normalizedStatus,
      Number(page) || 1,
      Number(limit) || 20,
      lang || req.user?.lang || 'en',
    );
    return { success: true, ...result };
  }

  @Get('venues/:venueId/requests')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async getVenueRequests(@Param('venueId') venueId: string, @Req() req) {
    const requests = await this.eventsService.getVenueRequests(
      venueId,
      req.user._id,
    );
    return { success: true, data: requests };
  }

  @Put('requests/:id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PARTNER)
  async updateRequestStatus(
    @Param('id') id: string,
    @Body() dto: UpdateEventVenueRequestStatusDto,
    @Req() req,
  ) {
    const request = await this.eventsService.updateRequestStatus(
      id,
      req.user._id,
      dto,
    );
    return { success: true, data: request };
  }

  @Get('venues/:id')
  async getVenueById(
    @Param('id') id: string,
    @Req() req,
    @Query('lang') lang?: string,
  ) {
    const displayLang = lang || req.user?.lang || 'en';
    const venue = await this.eventsService.getVenueById(id, displayLang);
    return { success: true, data: venue };
  }
}
