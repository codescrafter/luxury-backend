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

import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard(), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private catchResponse(action: string, error: any) {
    return {
      success: false,
      message: `Failed to ${action}`,
      error: error.message,
    };
  }

  // ----- Jetski -----
  @Post('jetski')
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
      const result = await this.productsService.createJetSkiHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('create jetski', error);
    }
  }

  @Put('jetski/:id')
  @Roles(Role.PARTNER)
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
      return this.catchResponse('update jetski', error);
    }
  }

  @Put('jetski/:id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveJetski(@Param('id') id: string) {
    try {
      const result = await this.productsService.approveJetSkiHandler(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('approve jetski', error);
    }
  }

  @Get('jetski')
  async getAllJetskis(@Query() filters: any) {
    try {
      const result = await this.productsService.getJetSkis(filters);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get jetskis', error);
    }
  }

  @Get('jetski/:id')
  async getJetskiById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getJetSkiById(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get jetski', error);
    }
  }

  // ----- Kayak -----
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
      const result = await this.productsService.createKayakHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('create kayak', error);
    }
  }

  @Put('kayak/:id')
  @Roles(Role.PARTNER)
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
      return this.catchResponse('update kayak', error);
    }
  }

  @Put('kayak/:id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveKayak(@Param('id') id: string) {
    try {
      const result = await this.productsService.approveKayakHandler(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('approve kayak', error);
    }
  }

  @Get('kayak')
  async getAllKayaks(@Query() filters: any) {
    try {
      const result = await this.productsService.getKayaks(filters);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get kayaks', error);
    }
  }

  @Get('kayak/:id')
  async getKayakById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getKayakById(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get kayak', error);
    }
  }

  // ----- Yacht -----
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
      const result = await this.productsService.createYachtHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('create yacht', error);
    }
  }

  @Put('yacht/:id')
  @Roles(Role.PARTNER)
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
      return this.catchResponse('update yacht', error);
    }
  }

  @Put('yacht/:id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveYacht(@Param('id') id: string) {
    try {
      const result = await this.productsService.approveYachtHandler(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('approve yacht', error);
    }
  }

  @Get('yacht')
  async getAllYachts(@Query() filters: any) {
    try {
      const result = await this.productsService.getYachts(filters);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get yachts', error);
    }
  }

  @Get('yacht/:id')
  async getYachtById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getYachtById(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get yacht', error);
    }
  }

  // ----- Speedboat -----
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
      const result = await this.productsService.createSpeedboatHandler(
        dto,
        files,
        req.user,
      );
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('create speedboat', error);
    }
  }

  @Put('speedboat/:id')
  @Roles(Role.PARTNER)
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
      return this.catchResponse('update speedboat', error);
    }
  }

  @Put('speedboat/:id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveSpeedboat(@Param('id') id: string) {
    try {
      const result = await this.productsService.approveSpeedboatHandler(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('approve speedboat', error);
    }
  }

  @Get('speedboat')
  async getAllSpeedboats(@Query() filters: any) {
    try {
      const result = await this.productsService.getSpeedboats(filters);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get speedboats', error);
    }
  }
  @Get('speedboat/:id')
  async getSpeedboatById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getSpeedboatById(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get speedboat', error);
    }
  }

  // ----- Resort -----
  @Post('resort')
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
      return this.catchResponse('create resort', error);
    }
  }

  @Put('resort/:id')
  @Roles(Role.PARTNER)
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
      return this.catchResponse('update resort', error);
    }
  }

  @Put('resort/:id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveResort(@Param('id') id: string) {
    try {
      const result = await this.productsService.approveResortHandler(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('approve resort', error);
    }
  }

  @Get('resort')
  async getAllResorts(@Query() filters: any) {
    try {
      const result = await this.productsService.getResorts(filters);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get resorts', error);
    }
  }

  @Get('resort/:id')
  async getResortById(@Param('id') id: string) {
    try {
      const result = await this.productsService.getResortById(id);
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get resort', error);
    }
  }

  @Get('pending')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllPendingProducts() {
    try {
      const result = await this.productsService.getAllPendingProducts();
      return { success: true, data: result };
    } catch (error) {
      return this.catchResponse('get pending products', error);
    }
  }
}
