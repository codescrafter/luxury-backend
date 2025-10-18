import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  SecurityGuard,
  SecurityGuardDocument,
} from './schemas/security-guard-schema';
import { Model } from 'mongoose';

@Injectable()
export class SecurityGuardJwtStrategy extends PassportStrategy(
  Strategy,
  'security-guard-jwt',
) {
  constructor(
    @InjectModel(SecurityGuard.name)
    private securityGuardModel: Model<SecurityGuardDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id, type } = payload;

    // Only validate if it's a security guard token
    if (type !== 'security_guard') {
      return null;
    }

    const securityGuard = await this.securityGuardModel.findById(id);
    if (!securityGuard) {
      throw new Error('Security guard not found');
    }

    return {
      ...securityGuard.toObject(),
      type: 'security_guard',
      lang: securityGuard.language || 'en',
    };
  }
}
