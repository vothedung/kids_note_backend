import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ISleepRecordRepository,
  SLEEP_RECORD_REPOSITORY,
} from '../repositories/sleep-record.repository.interface';

@Injectable()
export class DeleteSleepRecordUseCase {
  constructor(@Inject(SLEEP_RECORD_REPOSITORY) private readonly repo: ISleepRecordRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Sleep record not found');
    await this.repo.softDelete(input.id);
  }
}
