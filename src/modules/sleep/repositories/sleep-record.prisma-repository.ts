import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import { CreateSleepRecordData, ISleepRecordRepository } from './sleep-record.repository.interface';
import { SleepRecordEntity } from '../entities/sleep-record.entity';

@Injectable()
export class SleepRecordPrismaRepository implements ISleepRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SleepRecordEntity | null> {
    const record = await this.prisma.sleepRecord.findFirst({ where: { id, deletedAt: null } });
    return record ? SleepRecordEntity.fromPrisma(record) : null;
  }

  async findManyByChild(childId: string, params: { cursor?: string; limit: number }) {
    const { cursor, limit } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.sleepRecord.findMany({
      where: {
        childId,
        deletedAt: null,
        ...(cursorData ? { startedAt: { lte: new Date(cursorData.v) } } : {}),
      },
      orderBy: [{ startedAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursorData ? { skip: 1, cursor: { id: cursorData.id } } : {}),
    });

    const hasMore = records.length > limit;
    const data = hasMore ? records.slice(0, limit) : records;
    const nextCursor =
      hasMore && data.length > 0
        ? encodeCursor({
            id: data[data.length - 1].id,
            sortValue: data[data.length - 1].startedAt.toISOString(),
          })
        : null;

    return { data: data.map((r) => SleepRecordEntity.fromPrisma(r)), cursor: nextCursor, hasMore };
  }

  async findAllByChildSince(childId: string, since?: Date): Promise<SleepRecordEntity[]> {
    const records = await this.prisma.sleepRecord.findMany({
      where: { childId, deletedAt: null, ...(since ? { startedAt: { gte: since } } : {}) },
      orderBy: { startedAt: 'asc' },
    });
    return records.map((r) => SleepRecordEntity.fromPrisma(r));
  }

  async create(data: CreateSleepRecordData): Promise<SleepRecordEntity> {
    const record = await this.prisma.sleepRecord.create({ data });
    return SleepRecordEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateSleepRecordData>): Promise<SleepRecordEntity> {
    const record = await this.prisma.sleepRecord.update({ where: { id }, data });
    return SleepRecordEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.sleepRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
