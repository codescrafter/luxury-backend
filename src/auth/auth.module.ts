import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user-schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  UserVerificationSchema,
  UserVerification,
} from './schemas/user-verification-schema';
import { JwtStrategy } from './jwt.strategy';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SecurityGuardController } from './security-guard.controller';
import { SecurityGuardService } from './security-guard.service';
import {
  SecurityGuard,
  SecurityGuardSchema,
} from './schemas/security-guard-schema';
import { SecurityGuardJwtStrategy } from './security-guard-jwt.strategy';

@Module({
  imports: [
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
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserVerification.name, schema: UserVerificationSchema },
      { name: SecurityGuard.name, schema: SecurityGuardSchema },
    ]),
    ConfigModule,
    CloudinaryModule,
  ],
  controllers: [AuthController, SecurityGuardController],
  providers: [
    AuthService,
    JwtStrategy,
    SecurityGuardService,
    SecurityGuardJwtStrategy,
  ],
  exports: [JwtStrategy, SecurityGuardJwtStrategy, PassportModule],
})
export class AuthModule {}
