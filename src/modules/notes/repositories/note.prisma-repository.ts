import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { encodeCursor, decodeCursor } from '../../../common/dtos/pagination.dto';
import { CreateNoteData, INoteRepository } from './note.repository.interface';
import { NoteEntity } from '../entities/note.entity';

@Injectable()
export class NotePrismaRepository implements INoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<NoteEntity | null> {
    const record = await this.prisma.note.findFirst({ where: { id, deletedAt: null } });
    return record ? NoteEntity.fromPrisma(record) : null;
  }

  async findManyByChild(childId: string, params: { cursor?: string; limit: number }) {
    const { cursor, limit } = params;
    const cursorData = cursor ? decodeCursor(cursor) : undefined;

    const records = await this.prisma.note.findMany({
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

    return { data: data.map((r) => NoteEntity.fromPrisma(r)), cursor: nextCursor, hasMore };
  }

  async create(data: CreateNoteData): Promise<NoteEntity> {
    const record = await this.prisma.note.create({ data });
    return NoteEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateNoteData>): Promise<NoteEntity> {
    const record = await this.prisma.note.update({ where: { id }, data });
    return NoteEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.note.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
