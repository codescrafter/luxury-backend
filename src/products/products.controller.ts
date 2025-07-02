import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Get,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerMiddleware } from 'src/common/multer.middleware';

import { CreateYachtDto } from './dto/create-yacht.dto';
import { CreateSpeedboatDto } from './dto/create-speedboat.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { CreateJetskiDto } from './dto/create-jetski.dto';
import { CreateKayakDto } from './dto/create-kayak.dto';

import { UserDocument } from 'src/auth/schemas/user-schema';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard(), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('jetski')
  @UseGuards(AuthGuard())
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Body() dto: CreateJetskiDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.create(
        'jetski',
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create jetski',
        error: error.message,
      };
    }
  }

  @Post('kayak')
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Body() dto: CreateKayakDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.create(
        'kayak',
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create kayak',
        error: error.message,
      };
    }
  }

  @Post('yacht')
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Body() dto: CreateYachtDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.create(
        'yacht',
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create yacht',
        error: error.message,
      };
    }
  }

  @Post('speedboat')
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
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Body() dto: CreateSpeedboatDto,
    @Req() req,
  ) {
    try {
      const result = await this.productsService.create(
        'speedboat',
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create speedboat',
        error: error.message,
      };
    }
  }

  @Patch(':id')
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
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Req() { user }: { user: UserDocument },
  ) {
    try {
      const result = await this.productsService.update(id, dto, files, user);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update product',
        error: error.message,
      };
    }
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  async updateProductStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProductStatusDto,
  ) {
    try {
      const result = await this.productsService.updateStatus(id, dto);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update status',
        error: error.message,
      };
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const result = await this.productsService.findById(id);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        message: 'Product not found',
        error: error.message,
      };
    }
  }
}
