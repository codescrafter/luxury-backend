import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  SecurityGuard,
  SecurityGuardDocument,
} from './schemas/security-guard-schema';
import { Model } from 'mongoose';
import { COMMON_CODES } from '../i18n/namespaces/common.namespace';
import { AUTH_CODES } from '../i18n/namespaces/auth.namespace';

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
      throw new UnauthorizedException(AUTH_CODES.SECURITY_GUARD_NOT_FOUND);
    }

    // Check if security guard is active
    if (securityGuard.status !== 'active') {
      throw new UnauthorizedException(AUTH_CODES.SECURITY_GUARD_INACTIVE);
    }

    return {
      ...securityGuard.toObject(),
      type: 'security_guard',
      lang: securityGuard.language || 'en',
    };
  }
}

