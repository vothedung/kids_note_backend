import { Injectable } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMediaData, IMediaRepository, UpdateMediaData } from './media.repository.interface';
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

  async update(id: string, data: UpdateMediaData): Promise<MediaEntity> {
    const record = await this.prisma.media.update({ where: { id }, data });
    return MediaEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.media.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async sumBytesByFamily(familyId: string): Promise<{ imageBytes: number; videoBytes: number }> {
    const [images, videos] = await Promise.all([
      this.prisma.media.aggregate({
        where: { deletedAt: null, type: MediaType.IMAGE, child: { familyId } },
        _sum: { sizeBytes: true },
      }),
      this.prisma.media.aggregate({
        where: { deletedAt: null, type: MediaType.VIDEO, child: { familyId } },
        _sum: { sizeBytes: true },
      }),
    ]);

    return {
      imageBytes: images._sum.sizeBytes ?? 0,
      videoBytes: videos._sum.sizeBytes ?? 0,
    };
  }
}
