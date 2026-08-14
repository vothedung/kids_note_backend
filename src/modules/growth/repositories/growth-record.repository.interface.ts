import { GrowthRecordEntity } from '../entities/growth-record.entity';

export const GROWTH_RECORD_REPOSITORY = Symbol('GROWTH_RECORD_REPOSITORY');

export interface CreateGrowthRecordData {
  childId: string;
  weightKg?: number | null;
  heightCm?: number | null;
  headCircumCm?: number | null;
  recordedAt: Date;
}

export interface IGrowthRecordRepository {
  findById(id: string): Promise<GrowthRecordEntity | null>;
  findManyByChild(
    childId: string,
    params: { cursor?: string; limit: number },
  ): Promise<{ data: GrowthRecordEntity[]; cursor: string | null; hasMore: boolean }>;
  findAllByChildSince(childId: string, since?: Date): Promise<GrowthRecordEntity[]>;
  create(data: CreateGrowthRecordData): Promise<GrowthRecordEntity>;
  update(id: string, data: Partial<CreateGrowthRecordData>): Promise<GrowthRecordEntity>;
  softDelete(id: string): Promise<void>;
}
