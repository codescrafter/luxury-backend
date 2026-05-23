import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { RecipientType } from './enums/notification.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  /**
   * Internal method used by other modules to trigger notifications.
   * Future implementation: could publish to a Redis pub/sub or emit WebSockets here.
   */
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // 1. Deduplication Protection (1-minute threshold)
    const thresholdDate = new Date(Date.now() - 60 * 1000); // 1 minute ago
    
    const duplicateFilter: any = {
      action: createNotificationDto.action,
      createdAt: { $gte: thresholdDate },
    };

    if (createNotificationDto.recipientId) {
      duplicateFilter.recipientId = new Types.ObjectId(createNotificationDto.recipientId);
    } else {
      duplicateFilter.recipientType = createNotificationDto.recipientType;
    }

    if (createNotificationDto.entityId) {
      duplicateFilter.entityId = new Types.ObjectId(createNotificationDto.entityId);
    }

    const existingNotification = await this.notificationModel.findOne(duplicateFilter);
    if (existingNotification) {
      // Silently return the existing notification to prevent spam without breaking the flow
      return existingNotification;
    }

    // 2. Create the notification
    const createdNotification = new this.notificationModel(createNotificationDto);
    const savedNotification = await createdNotification.save();
    
    // Future: trigger real-time delivery
    // this.realtimeGateway.emitToUser(savedNotification.recipientId, 'new_notification', savedNotification);

    return savedNotification;
  }

  /**
   * Fetch notifications for a specific user, including broadcasts.
   */
  async findAllForUser(
    userId: string,
    role: string,
    query: QueryNotificationDto,
  ): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
    const { page = 1, limit = 10, isRead, type } = query;

    const filter: any = {
      $and: [
        {
          $or: [
            { recipientId: new Types.ObjectId(userId) },
            { recipientId: null, recipientType: role },
            { recipientId: null, recipientType: RecipientType.ALL },
          ],
        },
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } },
          ],
        },
      ],
    };

    if (isRead !== undefined) {
      filter.isRead = isRead;
    }

    if (type) {
      filter.type = type;
    }

    const skip = (page - 1) * limit;

    const [data, total, unreadCount] = await Promise.all([
      this.notificationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filter),
      this.notificationModel.countDocuments({ ...filter, isRead: false }),
    ]);

    return { data, total, unreadCount };
  }

  /**
   * Mark a specific notification as read.
   */
  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), recipientId: new Types.ObjectId(userId) },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException(`Notification #${id} not found or you don't have permission to update it.`);
    }

    return notification;
  }

  /**
   * Mark all notifications as read for a specific user.
   */
  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { recipientId: new Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return { modifiedCount: result.modifiedCount };
  }
}
