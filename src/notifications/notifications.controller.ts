import { Controller, Get, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { translate } from '../i18n/registry';
import { PRODUCT_CODES } from '../i18n/namespaces/product.namespace';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Req() req, @Query() query: QueryNotificationDto) {
    // Assuming req.user has _id and role populated by JwtStrategy
    const userId = req.user._id.toString();
    const role = req.user.role?.[0] || 'user'; // Defaults to user role if empty

    const result = await this.notificationsService.findAllForUser(userId, role, query);
    
    return {
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        unreadCount: result.unreadCount,
        page: query.page || 1,
        limit: query.limit || 10,
      },
    };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') id: string) {
    const userId = req.user._id.toString();
    const lang = req.user?.lang || req.user?.language || 'en';
    const notification = await this.notificationsService.markAsRead(id, userId);
    return {
      success: true,
      data: notification,
      message: translate(PRODUCT_CODES.NOTIFICATION_MARKED_READ, lang as any),
    };
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    const userId = req.user._id.toString();
    const lang = req.user?.lang || req.user?.language || 'en';
    const result = await this.notificationsService.markAllAsRead(userId);
    const message = translate(PRODUCT_CODES.NOTIFICATIONS_MARKED_READ, lang as any).replace(
      '{count}',
      String(result.modifiedCount),
    );
    return {
      success: true,
      data: result,
      message,
    };
  }
}
