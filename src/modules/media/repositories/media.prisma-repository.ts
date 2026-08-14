import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMediaData, IMediaRepository } from './media.repository.interface';
import { MediaEntity } from '../entities/media.entity';

@Injectable()
export class MediaPrismaRepository implements IMediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MediaEntity | null> {
    const record = await this.prisma.media.findFirst({ where: { id, deletedAt: null } });
    return record ? MediaEntity.fromPrisma(record) : null;
  }

  async findAllByChild(childId: string): Promise<MediaEntity[]> {
    const records = await this.prisma.media.findMany({
      where: { childId, deletedAt: null },
      orderBy: { takenAt: 'desc' },
    });
    return records.map((r) => MediaEntity.fromPrisma(r));
  }

  async create(data: CreateMediaData): Promise<MediaEntity> {
    const record = await this.prisma.media.create({ data });
    return MediaEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
