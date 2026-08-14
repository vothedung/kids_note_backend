import { NotificationEntity } from '../entities/notification.entity';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface CreateNotificationData {
  familyId: string;
  title: string;
  body: string;
}

export interface INotificationRepository {
  findById(id: string): Promise<NotificationEntity | null>;
  findManyByFamily(
    familyId: string,
    params: { cursor?: string; limit: number; unreadOnly?: boolean },
  ): Promise<{ data: NotificationEntity[]; cursor: string | null; hasMore: boolean }>;
  create(data: CreateNotificationData): Promise<NotificationEntity>;
  markRead(id: string): Promise<NotificationEntity>;
  markAllRead(familyId: string): Promise<number>;
}
