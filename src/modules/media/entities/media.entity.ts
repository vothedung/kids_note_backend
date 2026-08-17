import { MediaType } from '@prisma/client';

export class MediaEntity {
  id: string;
  childId: string;
  noteId?: string | null;
  albumId?: string | null;
  url: string;
  type: MediaType;
  caption?: string | null;
  sizeBytes?: number | null;
  takenAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): MediaEntity {
    const entity = new MediaEntity();
    Object.assign(entity, record);
    return entity;
  }
}
