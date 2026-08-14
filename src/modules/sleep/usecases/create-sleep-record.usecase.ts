import { Inject, Injectable } from '@nestjs/common';
import {
  ISleepRecordRepository,
  SLEEP_RECORD_REPOSITORY,
} from '../repositories/sleep-record.repository.interface';

@Injectable()
export class CreateSleepRecordUseCase {
  constructor(@Inject(SLEEP_RECORD_REPOSITORY) private readonly repo: ISleepRecordRepository) {}

  async execute(input: { childId: string; startedAt: string; endedAt?: string }) {
    return this.repo.create({
      childId: input.childId,
      startedAt: new Date(input.startedAt),
      endedAt: input.endedAt ? new Date(input.endedAt) : null,
    });
  }
}
