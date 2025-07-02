import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

// Entities
import { Jetski, JetskiSchema } from './entities/jetski.entity';
import { Kayak, KayakSchema } from './entities/kayak.entity';
import { Yacht, YachtSchema } from './entities/yacht.entity';
import { Speedboat, SpeedboatSchema } from './entities/speedboat.entity';
import { Resort, ResortSchema } from './entities/resort.entity';

import { User, UserSchema } from 'src/auth/schemas/user-schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Jetski.name, schema: JetskiSchema },
      { name: Kayak.name, schema: KayakSchema },
      { name: Yacht.name, schema: YachtSchema },
      { name: Speedboat.name, schema: SpeedboatSchema },
      { name: Resort.name, schema: ResortSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtStrategy],
})
export class ProductsModule {}
