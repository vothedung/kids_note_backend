import { Inject, Injectable } from '@nestjs/common';
import {
  FEEDING_RECORD_REPOSITORY,
  IFeedingRecordRepository,
} from '../repositories/feeding-record.repository.interface';

@Injectable()
export class ListFeedingRecordsUseCase {
  constructor(@Inject(FEEDING_RECORD_REPOSITORY) private readonly repo: IFeedingRecordRepository) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const { data, cursor, hasMore } = await this.repo.findManyByChild(input.childId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
