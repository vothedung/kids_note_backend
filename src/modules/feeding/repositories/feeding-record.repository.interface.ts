import { FeedingType } from '@prisma/client';
import { FeedingRecordEntity } from '../entities/feeding-record.entity';

export const FEEDING_RECORD_REPOSITORY = Symbol('FEEDING_RECORD_REPOSITORY');

export interface CreateFeedingRecordData {
  childId: string;
  category: FeedingType;
  amountMl?: number | null;
  recordedAt: Date;
}

export interface IFeedingRecordRepository {
  findById(id: string): Promise<FeedingRecordEntity | null>;
  findManyByChild(
    childId: string,
    params: { cursor?: string; limit: number },
  ): Promise<{ data: FeedingRecordEntity[]; cursor: string | null; hasMore: boolean }>;
  findAllByChildSince(childId: string, since?: Date): Promise<FeedingRecordEntity[]>;
  create(data: CreateFeedingRecordData): Promise<FeedingRecordEntity>;
  update(id: string, data: Partial<CreateFeedingRecordData>): Promise<FeedingRecordEntity>;
  softDelete(id: string): Promise<void>;
}
