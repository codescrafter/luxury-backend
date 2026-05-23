import { Controller, Get, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { QueryNotificationDto } from './dto/query-notification.dto';

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
    const notification = await this.notificationsService.markAsRead(id, userId);
    
    return {
      success: true,
      data: notification,
      message: 'Notification marked as read',
    };
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    const userId = req.user._id.toString();
    const result = await this.notificationsService.markAllAsRead(userId);
    
    return {
      success: true,
      data: result,
      message: `Successfully marked ${result.modifiedCount} notifications as read.`,
    };
  }
}
