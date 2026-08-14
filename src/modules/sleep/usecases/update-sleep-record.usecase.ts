import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ISleepRecordRepository,
  SLEEP_RECORD_REPOSITORY,
} from '../repositories/sleep-record.repository.interface';

@Injectable()
export class UpdateSleepRecordUseCase {
  constructor(@Inject(SLEEP_RECORD_REPOSITORY) private readonly repo: ISleepRecordRepository) {}

  async execute(input: { id: string; startedAt?: string; endedAt?: string }) {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Sleep record not found');
    return this.repo.update(input.id, {
      ...(input.startedAt ? { startedAt: new Date(input.startedAt) } : {}),
      ...(input.endedAt ? { endedAt: new Date(input.endedAt) } : {}),
    });
  }
}
