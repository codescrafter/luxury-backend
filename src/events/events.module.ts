import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventVenue, EventVenueSchema } from './entities/event-venue.entity';
import {
  EventVenueRequest,
  EventVenueRequestSchema,
} from './entities/event-venue-request.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User, UserSchema } from 'src/auth/schemas/user-schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventVenue.name, schema: EventVenueSchema },
      { name: EventVenueRequest.name, schema: EventVenueRequestSchema },
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
    NotificationsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtStrategy],
})
export class EventsModule {}
