import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SecurityGuardAuthGuard extends AuthGuard('security-guard-jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Security guard authentication required')
      );
    }

    // Ensure this is actually a security guard
    if (user.type !== 'security_guard') {
      throw new UnauthorizedException('Invalid token type for security guard');
    }

    return user;
  }
}
