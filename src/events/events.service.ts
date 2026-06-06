import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EventVenue, EventVenueDocument } from './entities/event-venue.entity';
import {
  EventVenueRequest,
  EventVenueRequestDocument,
  EventVenueRequestStatus,
} from './entities/event-venue-request.entity';
import { CreateEventVenueDto } from './dto/create-event-venue.dto';
import { UpdateEventVenueDto } from './dto/update-event-venue.dto';
import { CreateEventVenueRequestDto } from './dto/create-event-venue-request.dto';
import { UpdateEventVenueRequestStatusDto } from './dto/update-event-venue-request-status.dto';
import {
  transformProductForDualLanguage,
  transformProductsArrayForDualLanguage,
} from 'src/helpers/dto-helpers';
import { NotificationsFacadeService } from '../notifications/notifications-facade.service';
import { EVENT_CODES } from '../i18n/namespaces/event.namespace';

type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

/** Venue statuses that allow resubmission */
const RESUBMITTABLE_STATUSES = ['revision', 'rejected'] as const;

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventVenue.name)
    private readonly eventVenueModel: Model<EventVenueDocument>,
    @InjectModel(EventVenueRequest.name)
    private readonly eventVenueRequestModel: Model<EventVenueRequestDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsFacade: NotificationsFacadeService,
  ) {}

  // ─── Private media helpers ─────────────────────────────────────────────────

  private async uploadImages(files: any[] | undefined): Promise<string[]> {
    if (!files || files.length === 0) return [];
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          this.cloudinaryService.uploadImage(file, 'event-venues/images'),
        ),
      );
      return uploaded.map((item) => item.secure_url);
    } catch (error) {
      console.error('Event venue image upload error:', error);
      throw new BadRequestException(EVENT_CODES.IMAGE_UPLOAD_FAILED);
    }
  }

  private async uploadVideos(files: any[] | undefined): Promise<string[]> {
    if (!files || files.length === 0) return [];
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          this.cloudinaryService.uploadVideo(file, 'event-venues/videos'),
        ),
      );
      return uploaded.map((item) => item.secure_url);
    } catch (error) {
      console.error('Event venue video upload error:', error);
      throw new BadRequestException(EVENT_CODES.VIDEO_UPLOAD_FAILED);
    }
  }

  private async handleVenueMediaUpdate(
    venueId: Types.ObjectId,
    files: { images?: any[]; videos?: any[] } | undefined,
    updateDto: UpdateEventVenueDto,
  ) {
    // Edge case: venue must still exist before media update
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    let images = venue.images || [];
    let videos = venue.videos || [];

    if (files?.images && files.images.length > 0) {
      const uploadedImages = await this.uploadImages(files.images);
      if (updateDto.replaceImages) {
        if (images.length) {
          await this.cloudinaryService.deleteMultipleMedia(images, 'image');
        }
        images = uploadedImages;
      } else {
        images = [...images, ...uploadedImages];
      }
    }

    if (files?.videos && files.videos.length > 0) {
      const uploadedVideos = await this.uploadVideos(files.videos);
      if (updateDto.replaceVideos) {
        if (videos.length) {
          await this.cloudinaryService.deleteMultipleMedia(videos, 'video');
        }
        videos = uploadedVideos;
      } else {
        videos = [...videos, ...uploadedVideos];
      }
    }

    if (updateDto.deleteImageUrls?.length) {
      const deleteTargets = updateDto.deleteImageUrls;
      images = images.filter((img) => !deleteTargets.includes(img));
      await this.cloudinaryService.deleteMultipleMedia(deleteTargets, 'image');
    }

    if (updateDto.deleteVideoUrls?.length) {
      const deleteTargets = updateDto.deleteVideoUrls;
      videos = videos.filter((vid) => !deleteTargets.includes(vid));
      await this.cloudinaryService.deleteMultipleMedia(deleteTargets, 'video');
    }

    return { images, videos };
  }

  // ─── Venue CRUD ────────────────────────────────────────────────────────────

  async createVenue(
    dto: CreateEventVenueDto,
    files: { images?: any[]; videos?: any[] } | undefined,
    user: any,
  ) {
    const [imageUrls, videoUrls] = await Promise.all([
      this.uploadImages(files?.images),
      this.uploadVideos(files?.videos),
    ]);

    const venue = await this.eventVenueModel.create({
      ...dto,
      images: imageUrls,
      videos: videoUrls,
      ownerId: user._id,
      status: 'pending',
      type: 'event-venue',
    });

    await this.notificationsFacade.notifyAssetSubmitted(
      venue._id.toString(),
      'EventVenue',
      venue.titleEn,
      user._id.toString(),
    );

    return venue;
  }

  async updateVenue(
    id: string,
    dto: UpdateEventVenueDto,
    files: { images?: any[]; videos?: any[] } | undefined,
    user: any,
  ) {
    const venueId = new Types.ObjectId(id);

    // Edge case: venue must exist before any update
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    // Edge case: only owner or admin can update
    const isAdmin = user.role?.includes('admin');
    if (!isAdmin && venue.ownerId?.toString() !== user._id?.toString()) {
      throw new ForbiddenException(EVENT_CODES.NOT_VENUE_OWNER);
    }

    let images = venue.images || [];
    let videos = venue.videos || [];

    if (
      files?.images?.length ||
      files?.videos?.length ||
      dto.deleteImageUrls?.length ||
      dto.deleteVideoUrls?.length
    ) {
      const media = await this.handleVenueMediaUpdate(venueId, files, dto);
      images = media.images;
      videos = media.videos;
    }

    const updated = await this.eventVenueModel.findByIdAndUpdate(
      venueId,
      {
        ...dto,
        images,
        videos,
        status: 'pending',
      },
      { new: true },
    );

    return updated;
  }

  async getVenueById(id: string, lang?: string) {
    const venue = await this.eventVenueModel.findById(id).lean();
    if (!venue) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }
    return transformProductForDualLanguage(venue, lang);
  }

  async getPublicVenues(
    lang: string = 'en',
    page: number = 1,
    limit: number = 20,
    filters: {
      city?: string;
      tags?: string[];
      minCapacity?: number;
      maxCapacity?: number;
      isIndoor?: boolean;
      isOutdoor?: boolean;
      search?: string;
    } = {},
  ) {
    const andConditions: any[] = [{ status: 'approved' }];

    if (filters.city) {
      andConditions.push({
        $or: [{ cityEn: filters.city }, { cityAr: filters.city }],
      });
    }

    if (filters.tags?.length) {
      andConditions.push({
        $or: [
          { tagsEn: { $in: filters.tags } },
          { tagsAr: { $in: filters.tags } },
        ],
      });
    }

    if (
      filters.minCapacity !== undefined ||
      filters.maxCapacity !== undefined
    ) {
      const capacityCond: any = {};
      if (filters.minCapacity !== undefined) {
        capacityCond.$gte = filters.minCapacity;
      }
      if (filters.maxCapacity !== undefined) {
        capacityCond.$lte = filters.maxCapacity;
      }
      andConditions.push({ guestCapacity: capacityCond });
    }

    if (filters.isIndoor !== undefined) {
      andConditions.push({ isIndoor: filters.isIndoor });
    }

    if (filters.isOutdoor !== undefined) {
      andConditions.push({ isOutdoor: filters.isOutdoor });
    }

    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      andConditions.push({
        $or: [
          { titleEn: regex },
          { titleAr: regex },
          { descriptionEn: regex },
          { descriptionAr: regex },
        ],
      });
    }

    const query =
      andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    const skip = (page - 1) * limit;

    const [total, venues] = await Promise.all([
      this.eventVenueModel.countDocuments(query),
      this.eventVenueModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const data = transformProductsArrayForDualLanguage(venues, lang);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getVenuesByStatus(
    statuses: string[],
    ownerId?: string,
    displayLang?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const filter: any = {
      status: { $in: statuses },
    };

    if (ownerId) {
      filter.ownerId = new Types.ObjectId(ownerId);
    }

    const skip = (page - 1) * limit;

    const [total, venues] = await Promise.all([
      this.eventVenueModel.countDocuments(filter),
      this.eventVenueModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const data = transformProductsArrayForDualLanguage(venues, displayLang);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // ─── Admin venue lifecycle actions ─────────────────────────────────────────

  async approveVenue(id: string) {
    // Edge case: fetch first to validate current state before update
    const existing = await this.eventVenueModel.findById(id);
    if (!existing) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    // Edge case: approving an already-approved venue is a state conflict
    if (existing.status === 'approved') {
      throw new ConflictException(EVENT_CODES.VENUE_ALREADY_APPROVED);
    }

    const venue = await this.eventVenueModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );

    // Edge case: venue owner missing (orphan venue) — notify but don't crash
    if (venue && venue.ownerId) {
      await this.notificationsFacade.notifyAssetApproved(
        venue._id.toString(),
        'EventVenue',
        venue.titleEn,
        venue.ownerId.toString(),
      );
    }

    return venue;
  }

  async markVenueForRevision(id: string) {
    const existing = await this.eventVenueModel.findById(id);
    if (!existing) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    // Edge case: cannot request revision on an already-rejected venue
    if (existing.status === 'rejected') {
      throw new ConflictException(EVENT_CODES.INVALID_STATUS_TRANSITION);
    }

    const venue = await this.eventVenueModel.findByIdAndUpdate(
      id,
      { status: 'revision', $inc: { resubmissionCount: 1 } },
      { new: true },
    );

    if (venue && venue.ownerId) {
      await this.notificationsFacade.notifyAssetRevisionRequested(
        venue._id.toString(),
        'EventVenue',
        venue.titleEn,
        venue.ownerId.toString(),
      );
    }

    return venue;
  }

  async rejectVenue(id: string, reason?: string) {
    const existing = await this.eventVenueModel.findById(id);
    if (!existing) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    // Edge case: rejecting an already-rejected venue is idempotent conflict
    if (existing.status === 'rejected') {
      throw new ConflictException(EVENT_CODES.VENUE_ALREADY_REJECTED);
    }

    const venue = await this.eventVenueModel.findByIdAndUpdate(
      id,
      { status: 'rejected', ...(reason ? { rejectionReason: reason } : {}) },
      { new: true },
    );

    if (venue && venue.ownerId) {
      await this.notificationsFacade.notifyAssetRejected(
        venue._id.toString(),
        'EventVenue',
        venue.titleEn,
        venue.ownerId.toString(),
        reason,
      );
    }

    return venue;
  }

  async resubmitVenue(id: string, userId: string, isAdmin: boolean = false) {
    const filter: any = { _id: id };
    if (!isAdmin) {
      filter.ownerId = userId;
    }

    // Edge case: fetch first to check resubmittable state
    const existing = await this.eventVenueModel.findOne({ _id: id });
    if (!existing) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    // Edge case: only revision/rejected venues can be resubmitted
    if (!RESUBMITTABLE_STATUSES.includes(existing.status as any)) {
      throw new ConflictException(EVENT_CODES.VENUE_CANNOT_RESUBMIT);
    }

    // Edge case: non-admin accessing a venue they don't own
    if (!isAdmin && existing.ownerId?.toString() !== userId) {
      throw new ForbiddenException(EVENT_CODES.NOT_VENUE_OWNER);
    }

    const venue = await this.eventVenueModel.findOneAndUpdate(
      filter,
      { status: 'pending', $inc: { resubmissionCount: 1 } },
      { new: true },
    );

    if (!venue) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    await this.notificationsFacade.notifyAssetSubmitted(
      venue._id.toString(),
      'EventVenue',
      venue.titleEn,
      userId,
    );

    return venue;
  }

  // ─── Venue request flow ────────────────────────────────────────────────────

  async createVenueRequest(
    venueId: string,
    dto: CreateEventVenueRequestDto,
    user?: any,
  ) {
    // Edge case: venue must exist AND be approved — two distinct failure modes
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }
    if (venue.status !== 'approved') {
      throw new BadRequestException(EVENT_CODES.VENUE_NOT_AVAILABLE);
    }

    // Edge case: orphan venue — owner must exist
    if (!venue.ownerId) {
      throw new BadRequestException(EVENT_CODES.VENUE_OWNER_NOT_FOUND);
    }

    const request = await this.eventVenueRequestModel.create({
      venueId: venue._id,
      partnerId: venue.ownerId,
      userId: user?._id,
      ...dto,
      status: EventVenueRequestStatus.PENDING,
    });

    if (user) {
      await this.notificationsFacade.notifyBookingCreated(
        request._id.toString(),
        request.partnerId.toString(),
        user._id.toString(),
        venue.titleEn,
      );
    }

    return request;
  }

  async getPartnerRequests(
    partnerId: string,
    status?: EventVenueRequestStatus,
    page: number = 1,
    limit: number = 20,
    displayLang: string = 'en',
  ): Promise<PaginatedResult<any>> {
    const filter: any = {
      partnerId: new Types.ObjectId(partnerId),
    };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [total, requests] = await Promise.all([
      this.eventVenueRequestModel.countDocuments(filter),
      this.eventVenueRequestModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('venueId')
        .lean(),
    ]);

    const data = requests.map((request) => ({
      ...request,
      venue:
        request.venueId &&
        transformProductForDualLanguage(request.venueId, displayLang),
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getVenueRequests(venueId: string, partnerId: string) {
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue) {
      throw new NotFoundException(EVENT_CODES.VENUE_NOT_FOUND);
    }

    // Edge case: partner can only see requests for their own venues
    if (venue.ownerId?.toString() !== partnerId?.toString()) {
      throw new ForbiddenException(EVENT_CODES.NOT_VENUE_OWNER);
    }

    const requests = await this.eventVenueRequestModel
      .find({ venueId: venue._id })
      .sort({ createdAt: -1 })
      .lean();

    return requests;
  }

  async updateRequestStatus(
    requestId: string,
    partnerId: string,
    dto: UpdateEventVenueRequestStatusDto,
  ) {
    const request = await this.eventVenueRequestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException(EVENT_CODES.REQUEST_NOT_FOUND);
    }

    // Edge case: only the partner owning the venue can update this request
    if (request.partnerId?.toString() !== partnerId?.toString()) {
      throw new ForbiddenException(EVENT_CODES.NOT_REQUEST_OWNER);
    }

    // Edge case: cannot update a request that has already been responded to
    if (request.status !== EventVenueRequestStatus.PENDING) {
      throw new ConflictException(EVENT_CODES.REQUEST_ALREADY_RESPONDED);
    }

    request.status = dto.status;
    if (dto.partnerNotes) {
      request.partnerNotes = dto.partnerNotes;
    }

    if (dto.status !== EventVenueRequestStatus.PENDING) {
      request.respondedAt = new Date();
    }

    await request.save();

    // Populate venue to get titleEn for notification
    await request.populate('venueId');
    const venueTitle = request.venueId
      ? (request.venueId as any).titleEn
      : 'Event Venue';

    if (dto.status === EventVenueRequestStatus.CONTACTED && request.userId) {
      await this.notificationsFacade.notifyBookingConfirmed(
        request._id.toString(),
        request.userId.toString(),
        venueTitle,
      );
    } else if (
      dto.status === EventVenueRequestStatus.DISMISSED &&
      request.userId
    ) {
      await this.notificationsFacade.notifyBookingRejected(
        request._id.toString(),
        request.userId.toString(),
        venueTitle,
      );
    }

    return request;
  }
}
