import { MediaType } from '@prisma/client';
import { MediaEntity } from '../entities/media.entity';

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface CreateMediaData {
  childId: string;
  noteId?: string | null;
  url: string;
  type: MediaType;
  sizeBytes?: number | null;
  takenAt: Date;
}

export interface UpdateMediaData {
  caption?: string | null;
  albumId?: string | null;
}

export interface IMediaRepository {
  findById(id: string): Promise<MediaEntity | null>;
  findAllByChild(childId: string): Promise<MediaEntity[]>;
  create(data: CreateMediaData): Promise<MediaEntity>;
  update(id: string, data: UpdateMediaData): Promise<MediaEntity>;
  softDelete(id: string): Promise<void>;
  sumBytesByFamily(familyId: string): Promise<{ imageBytes: number; videoBytes: number }>;
}
