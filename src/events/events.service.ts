import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventVenue.name)
    private readonly eventVenueModel: Model<EventVenueDocument>,
    @InjectModel(EventVenueRequest.name)
    private readonly eventVenueRequestModel: Model<EventVenueRequestDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async uploadImages(files: any[] | undefined) {
    if (!files || files.length === 0) {
      return [];
    }
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          this.cloudinaryService.uploadImage(file, 'event-venues/images'),
        ),
      );
      return uploaded.map((item) => item.secure_url);
    } catch (error) {
      console.error('Event venue image upload error:', error);
      throw new HttpException(
        `Failed to upload images: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async uploadVideos(files: any[] | undefined) {
    if (!files || files.length === 0) {
      return [];
    }
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          this.cloudinaryService.uploadVideo(file, 'event-venues/videos'),
        ),
      );
      return uploaded.map((item) => item.secure_url);
    } catch (error) {
      console.error('Event venue video upload error:', error);
      throw new HttpException(
        `Failed to upload videos: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async handleVenueMediaUpdate(
    venueId: Types.ObjectId,
    files: { images?: any[]; videos?: any[] } | undefined,
    updateDto: UpdateEventVenueDto,
  ) {
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue) {
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
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

    return venue;
  }

  async updateVenue(
    id: string,
    dto: UpdateEventVenueDto,
    files: { images?: any[]; videos?: any[] } | undefined,
    user: any,
  ) {
    const venueId = new Types.ObjectId(id);
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue) {
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
    }

    const isAdmin = user.role?.includes('admin');
    if (!isAdmin && venue.ownerId?.toString() !== user._id?.toString()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
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

  async approveVenue(id: string) {
    const venue = await this.eventVenueModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
    if (!venue) {
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
    }
    return venue;
  }

  async markVenueForRevision(id: string) {
    const venue = await this.eventVenueModel.findByIdAndUpdate(
      id,
      { status: 'revision', $inc: { resubmissionCount: 1 } },
      { new: true },
    );
    if (!venue) {
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
    }
    return venue;
  }

  async rejectVenue(id: string, reason?: string) {
    const venue = await this.eventVenueModel.findByIdAndUpdate(
      id,
      { status: 'rejected', ...(reason ? { rejectionReason: reason } : {}) },
      { new: true },
    );
    if (!venue) {
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
    }
    return venue;
  }

  async resubmitVenue(id: string, userId: string, isAdmin: boolean = false) {
    const filter: any = { _id: id };
    if (!isAdmin) {
      filter.ownerId = userId;
    }
    const venue = await this.eventVenueModel.findOneAndUpdate(
      filter,
      { status: 'pending', $inc: { resubmissionCount: 1 } },
      { new: true },
    );
    if (!venue) {
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
    }
    return venue;
  }

  async createVenueRequest(
    venueId: string,
    dto: CreateEventVenueRequestDto,
    user?: any,
  ) {
    const venue = await this.eventVenueModel.findById(venueId);
    if (!venue || venue.status !== 'approved') {
      throw new HttpException(
        'Event venue not available for requests',
        HttpStatus.BAD_REQUEST,
      );
    }

    const request = await this.eventVenueRequestModel.create({
      venueId: venue._id,
      partnerId: venue.ownerId,
      userId: user?._id,
      ...dto,
      status: EventVenueRequestStatus.PENDING,
    });

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
      throw new HttpException('Event venue not found', HttpStatus.NOT_FOUND);
    }

    if (venue.ownerId?.toString() !== partnerId?.toString()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    if (request.partnerId?.toString() !== partnerId?.toString()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    request.status = dto.status;
    if (dto.partnerNotes) {
      request.partnerNotes = dto.partnerNotes;
    }

    if (dto.status !== EventVenueRequestStatus.PENDING) {
      request.respondedAt = new Date();
    }

    await request.save();
    return request;
  }
}
