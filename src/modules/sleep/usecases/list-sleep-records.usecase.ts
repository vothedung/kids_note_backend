import { Inject, Injectable } from '@nestjs/common';
import {
  ISleepRecordRepository,
  SLEEP_RECORD_REPOSITORY,
} from '../repositories/sleep-record.repository.interface';

@Injectable()
export class ListSleepRecordsUseCase {
  constructor(@Inject(SLEEP_RECORD_REPOSITORY) private readonly repo: ISleepRecordRepository) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const { data, cursor, hasMore } = await this.repo.findManyByChild(input.childId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
