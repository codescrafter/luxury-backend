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

  private buildFilterQuery(filters: any) {
    const query: any = {};
    if (filters.numberOfPeople)
      query.capacity = { $gte: +filters.numberOfPeople };
    if (filters.city) query.city = filters.city;
    if (filters.region) query.region = filters.region;
    if (filters.country) query.country = filters.country;
    return query;
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

  async getJetSkis(filters: any) {
    return this.jetSkiModel.find(this.buildFilterQuery(filters));
  }

  async getJetSkiById(id: string) {
    return this.jetSkiModel.findById(id);
  }

  async approveJetSkiHandler(id: string) {
    return this.jetSkiModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
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

  async getKayaks(filters: any) {
    return this.kayakModel.find(this.buildFilterQuery(filters));
  }

  async getKayakById(id: string) {
    return this.kayakModel.findById(id);
  }

  async approveKayakHandler(id: string) {
    return this.kayakModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
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

  async getYachts(filters: any) {
    return this.yachtModel.find(this.buildFilterQuery(filters));
  }

  async getYachtById(id: string) {
    return this.yachtModel.findById(id);
  }

  async approveYachtHandler(id: string) {
    return this.yachtModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
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

  async getSpeedboats(filters: any) {
    return this.speedboatModel.find(this.buildFilterQuery(filters));
  }

  async getSpeedboatById(id: string) {
    return this.speedboatModel.findById(id);
  }

  async approveSpeedboatHandler(id: string) {
    return this.speedboatModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
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

  async getResorts(filters: any) {
    return this.resortModel.find(this.buildFilterQuery(filters));
  }

  async getResortById(id: string) {
    return this.resortModel.findById(id);
  }

  async approveResortHandler(id: string) {
    return this.resortModel.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true },
    );
  }

  async getAllPendingProducts() {
    const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
      this.jetSkiModel.find({ status: 'pending' }),
      this.kayakModel.find({ status: 'pending' }),
      this.yachtModel.find({ status: 'pending' }),
      this.speedboatModel.find({ status: 'pending' }),
      this.resortModel.find({ status: 'pending' }),
    ]);
    return { jetskis, kayaks, yachts, speedboats, resorts };
  }
}
