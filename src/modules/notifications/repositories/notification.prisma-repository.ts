import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import {
  CreateNotificationData,
  INotificationRepository,
} from './notification.repository.interface';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationPrismaRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<NotificationEntity | null> {
    const record = await this.prisma.notification.findFirst({ where: { id, deletedAt: null } });
    return record ? NotificationEntity.fromPrisma(record) : null;
  }

  async findManyByFamily(
    familyId: string,
    params: { cursor?: string; limit: number; unreadOnly?: boolean },
  ) {
    const { cursor, limit, unreadOnly } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.notification.findMany({
      where: {
        familyId,
        deletedAt: null,
        ...(unreadOnly ? { isRead: false } : {}),
        ...(cursorData ? { createdAt: { lte: new Date(cursorData.v) } } : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursorData ? { skip: 1, cursor: { id: cursorData.id } } : {}),
    });

    const hasMore = records.length > limit;
    const data = hasMore ? records.slice(0, limit) : records;
    const nextCursor =
      hasMore && data.length > 0
        ? encodeCursor({
            id: data[data.length - 1].id,
            sortValue: data[data.length - 1].createdAt.toISOString(),
          })
        : null;

    return { data: data.map((r) => NotificationEntity.fromPrisma(r)), cursor: nextCursor, hasMore };
  }

  async create(data: CreateNotificationData): Promise<NotificationEntity> {
    const record = await this.prisma.notification.create({ data });
    return NotificationEntity.fromPrisma(record);
  }

  async markRead(id: string): Promise<NotificationEntity> {
    const record = await this.prisma.notification.update({ where: { id }, data: { isRead: true } });
    return NotificationEntity.fromPrisma(record);
  }

  async markAllRead(familyId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { familyId, isRead: false, deletedAt: null },
      data: { isRead: true },
    });
    return result.count;
  }

  async countUnread(familyId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { familyId, isRead: false, deletedAt: null },
    });
  }
}
