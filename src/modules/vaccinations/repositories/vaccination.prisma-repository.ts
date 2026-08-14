import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import { CreateVaccinationData, IVaccinationRepository } from './vaccination.repository.interface';
import { VaccinationEntity } from '../entities/vaccination.entity';

@Injectable()
export class VaccinationPrismaRepository implements IVaccinationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VaccinationEntity | null> {
    const record = await this.prisma.vaccination.findFirst({ where: { id, deletedAt: null } });
    return record ? VaccinationEntity.fromPrisma(record) : null;
  }

  async findManyByChild(childId: string, params: { cursor?: string; limit: number }) {
    const { cursor, limit } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.vaccination.findMany({
      where: {
        childId,
        deletedAt: null,
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

    return { data: data.map((r) => VaccinationEntity.fromPrisma(r)), cursor: nextCursor, hasMore };
  }

  async create(data: CreateVaccinationData): Promise<VaccinationEntity> {
    const record = await this.prisma.vaccination.create({ data });
    return VaccinationEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateVaccinationData>): Promise<VaccinationEntity> {
    const record = await this.prisma.vaccination.update({ where: { id }, data });
    return VaccinationEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.vaccination.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
