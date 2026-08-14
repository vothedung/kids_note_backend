import { MediaType } from '@prisma/client';
import { MediaEntity } from '../entities/media.entity';

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');

export interface CreateMediaData {
  childId: string;
  noteId?: string | null;
  url: string;
  type: MediaType;
  takenAt: Date;
}

export interface IMediaRepository {
  findById(id: string): Promise<MediaEntity | null>;
  findAllByChild(childId: string): Promise<MediaEntity[]>;
  create(data: CreateMediaData): Promise<MediaEntity>;
  softDelete(id: string): Promise<void>;
}
