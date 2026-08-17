import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAlbumData, IAlbumRepository } from './album.repository.interface';
import { AlbumEntity } from '../entities/album.entity';

@Injectable()
export class AlbumPrismaRepository implements IAlbumRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AlbumEntity | null> {
    const record = await this.prisma.album.findFirst({ where: { id, deletedAt: null } });
    return record ? AlbumEntity.fromPrisma(record) : null;
  }

  async findAllByChild(childId: string): Promise<AlbumEntity[]> {
    const records = await this.prisma.album.findMany({
      where: { childId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => AlbumEntity.fromPrisma(r));
  }

  async create(data: CreateAlbumData): Promise<AlbumEntity> {
    const record = await this.prisma.album.create({ data });
    return AlbumEntity.fromPrisma(record);
  }
}
