import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import {
  CreateGrowthRecordData,
  IGrowthRecordRepository,
} from './growth-record.repository.interface';
import { GrowthRecordEntity } from '../entities/growth-record.entity';

@Injectable()
export class GrowthRecordPrismaRepository implements IGrowthRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<GrowthRecordEntity | null> {
    const record = await this.prisma.growthRecord.findFirst({ where: { id, deletedAt: null } });
    return record ? GrowthRecordEntity.fromPrisma(record) : null;
  }

  async findManyByChild(childId: string, params: { cursor?: string; limit: number }) {
    const { cursor, limit } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.growthRecord.findMany({
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

    return { data: data.map((r) => GrowthRecordEntity.fromPrisma(r)), cursor: nextCursor, hasMore };
  }

  async findAllByChildSince(childId: string, since?: Date): Promise<GrowthRecordEntity[]> {
    const records = await this.prisma.growthRecord.findMany({
      where: { childId, deletedAt: null, ...(since ? { recordedAt: { gte: since } } : {}) },
      orderBy: { recordedAt: 'asc' },
    });
    return records.map((r) => GrowthRecordEntity.fromPrisma(r));
  }

  async create(data: CreateGrowthRecordData): Promise<GrowthRecordEntity> {
    const record = await this.prisma.growthRecord.create({ data });
    return GrowthRecordEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateGrowthRecordData>): Promise<GrowthRecordEntity> {
    const record = await this.prisma.growthRecord.update({ where: { id }, data });
    return GrowthRecordEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.growthRecord.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
