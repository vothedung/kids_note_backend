import { FeedingType } from '@prisma/client';

export class FeedingRecordEntity {
  id: string;
  childId: string;
  category: FeedingType;
  amountMl?: number | null;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): FeedingRecordEntity {
    const entity = new FeedingRecordEntity();
    Object.assign(entity, record);
    return entity;
  }
}
