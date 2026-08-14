import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FEEDING_RECORD_REPOSITORY,
  IFeedingRecordRepository,
} from '../repositories/feeding-record.repository.interface';

@Injectable()
export class DeleteFeedingRecordUseCase {
  constructor(@Inject(FEEDING_RECORD_REPOSITORY) private readonly repo: IFeedingRecordRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Feeding record not found');
    await this.repo.softDelete(input.id);
  }
}
