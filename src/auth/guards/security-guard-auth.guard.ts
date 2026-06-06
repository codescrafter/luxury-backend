import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { COMMON_CODES } from '../../i18n/namespaces/common.namespace';

@Injectable()
export class SecurityGuardAuthGuard extends AuthGuard('security-guard-jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(COMMON_CODES.SECURITY_GUARD_AUTH_REQUIRED)
      );
    }

    // Ensure this is actually a security guard
    if (user.type !== 'security_guard') {
      throw new UnauthorizedException(
        COMMON_CODES.INVALID_SECURITY_GUARD_TOKEN,
      );
    }

    return user;
  }
}

