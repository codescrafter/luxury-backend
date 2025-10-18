import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UnifiedAuthGuard extends AuthGuard(['jwt', 'security-guard-jwt']) {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new Error('Authentication failed');
    }
    return user;
  }
}
