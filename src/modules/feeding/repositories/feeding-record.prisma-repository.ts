import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import {
  CreateFeedingRecordData,
  IFeedingRecordRepository,
} from './feeding-record.repository.interface';
import { FeedingRecordEntity } from '../entities/feeding-record.entity';

@Injectable()
export class FeedingRecordPrismaRepository implements IFeedingRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FeedingRecordEntity | null> {
    const record = await this.prisma.feedingRecord.findFirst({ where: { id, deletedAt: null } });
    return record ? FeedingRecordEntity.fromPrisma(record) : null;
  }

  async findManyByChild(childId: string, params: { cursor?: string; limit: number }) {
    const { cursor, limit } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.feedingRecord.findMany({
      where: {
        childId,
        deletedAt: null,
        ...(cursorData ? { recordedAt: { lte: new Date(cursorData.v) } } : {}),
      },
      orderBy: [{ recordedAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursorData ? { skip: 1, cursor: { id: cursorData.id } } : {}),
    });

    const hasMore = records.length > limit;
    const data = hasMore ? records.slice(0, limit) : records;
    const nextCursor =
      hasMore && data.length > 0
        ? encodeCursor({
            id: data[data.length - 1].id,
            sortValue: data[data.length - 1].recordedAt.toISOString(),
          })
        : null;

    return {
      data: data.map((r) => FeedingRecordEntity.fromPrisma(r)),
      cursor: nextCursor,
      hasMore,
    };
  }

  async findAllByChildSince(childId: string, since?: Date): Promise<FeedingRecordEntity[]> {
    const records = await this.prisma.feedingRecord.findMany({
      where: { childId, deletedAt: null, ...(since ? { recordedAt: { gte: since } } : {}) },
      orderBy: { recordedAt: 'asc' },
    });
    return records.map((r) => FeedingRecordEntity.fromPrisma(r));
  }

  async create(data: CreateFeedingRecordData): Promise<FeedingRecordEntity> {
    const record = await this.prisma.feedingRecord.create({ data });
    return FeedingRecordEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateFeedingRecordData>): Promise<FeedingRecordEntity> {
    const record = await this.prisma.feedingRecord.update({ where: { id }, data });
    return FeedingRecordEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.feedingRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
