import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserDocument } from 'src/auth/schemas/user-schema';
import { Jetski, JetskiDocument } from './entities/jetski.entity';
import { Kayak, KayakDocument } from './entities/kayak.entity';
import { Yacht, YachtDocument } from './entities/yacht.entity';
import { Speedboat, SpeedboatDocument } from './entities/speedboat.entity';
import { Resort, ResortDocument } from './entities/resort.entity';
import { CreateJetskiDto, UpdateJetskiDto } from './dto/jetski.dto';
import { CreateKayakDto, UpdateKayakDto } from './dto/kayak.dto';
import { CreateYachtDto, UpdateYachtDto } from './dto/yacht.dto';
import { CreateSpeedboatDto, UpdateSpeedboatDto } from './dto/speedboat.dto';
import { CreateResortDto, UpdateResortDto } from './dto/resort.dto';
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
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async uploadMedia(
    files: Express.Multer.File[] | undefined,
    folder: string,
  ) {
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

  async getAllPendingProducts(showRejected = false) {
    const statusFilter = showRejected ? ['pending', 'revision', 'rejected'] : ['pending', 'revision'];
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: { $in: statusFilter } }),
      this.kayakModel.find({ status: { $in: statusFilter } }),
      this.yachtModel.find({ status: { $in: statusFilter } }),
      this.speedboatModel.find({ status: { $in: statusFilter } }),
      this.resortModel.find({ status: { $in: statusFilter } }),
    ]);
    return { jetskis, kayaks, yachts, speedboats, resorts };
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
    return [
      ...jetskis,
      ...kayaks,
      ...yachts,
      ...speedboats,
      ...resorts,
    ];
  }

  // --- UNAVAILABILITY METHODS ---

  /**
   * Create or update unavailability for a product (per day)
   */
  // Removed setUnavailability

  // Removed getUnavailability

  // Removed getUnavailableProductIds

  // Removed bookProduct

  // Removed getAllBookings

  // Removed getUserBookings

  // Removed approveBooking

  // Removed rejectBooking

 // In the approveOrRejectProduct method, change this:
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
}
