import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import { CreateMilestoneData, IMilestoneRepository } from './milestone.repository.interface';
import { MilestoneEntity } from '../entities/milestone.entity';

@Injectable()
export class MilestonePrismaRepository implements IMilestoneRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MilestoneEntity | null> {
    const record = await this.prisma.milestone.findFirst({ where: { id, deletedAt: null } });
    return record ? MilestoneEntity.fromPrisma(record) : null;
  }

  async findManyByChild(childId: string, params: { cursor?: string; limit: number }) {
    const { cursor, limit } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.milestone.findMany({
      where: {
        childId,
        deletedAt: null,
        ...(cursorData ? { milestoneDate: { lte: new Date(cursorData.v) } } : {}),
      },
      orderBy: [{ milestoneDate: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursorData ? { skip: 1, cursor: { id: cursorData.id } } : {}),
    });

    const hasMore = records.length > limit;
    const data = hasMore ? records.slice(0, limit) : records;
    const nextCursor =
      hasMore && data.length > 0
        ? encodeCursor({
            id: data[data.length - 1].id,
            sortValue: data[data.length - 1].milestoneDate.toISOString(),
          })
        : null;

    return { data: data.map((r) => MilestoneEntity.fromPrisma(r)), cursor: nextCursor, hasMore };
  }

  async create(data: CreateMilestoneData): Promise<MilestoneEntity> {
    const record = await this.prisma.milestone.create({ data });
    return MilestoneEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateMilestoneData>): Promise<MilestoneEntity> {
    const record = await this.prisma.milestone.update({ where: { id }, data });
    return MilestoneEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.milestone.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
