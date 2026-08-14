import { Inject, Injectable } from '@nestjs/common';
import {
  GROWTH_RECORD_REPOSITORY,
  IGrowthRecordRepository,
} from '../repositories/growth-record.repository.interface';

@Injectable()
export class ListGrowthRecordsUseCase {
  constructor(@Inject(GROWTH_RECORD_REPOSITORY) private readonly repo: IGrowthRecordRepository) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const { data, cursor, hasMore } = await this.repo.findManyByChild(input.childId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
