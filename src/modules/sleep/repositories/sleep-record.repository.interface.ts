import { SleepRecordEntity } from '../entities/sleep-record.entity';

export const SLEEP_RECORD_REPOSITORY = Symbol('SLEEP_RECORD_REPOSITORY');

export interface CreateSleepRecordData {
  childId: string;
  startedAt: Date;
  endedAt?: Date | null;
}

export interface ISleepRecordRepository {
  findById(id: string): Promise<SleepRecordEntity | null>;
  findManyByChild(
    childId: string,
    params: { cursor?: string; limit: number },
  ): Promise<{ data: SleepRecordEntity[]; cursor: string | null; hasMore: boolean }>;
  findAllByChildSince(childId: string, since?: Date): Promise<SleepRecordEntity[]>;
  create(data: CreateSleepRecordData): Promise<SleepRecordEntity>;
  update(id: string, data: Partial<CreateSleepRecordData>): Promise<SleepRecordEntity>;
  softDelete(id: string): Promise<void>;
}
