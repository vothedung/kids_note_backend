import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FEEDING_RECORD_REPOSITORY,
  IFeedingRecordRepository,
} from '../repositories/feeding-record.repository.interface';
import { FeedingType } from '@prisma/client';

@Injectable()
export class UpdateFeedingRecordUseCase {
  constructor(@Inject(FEEDING_RECORD_REPOSITORY) private readonly repo: IFeedingRecordRepository) {}

  async execute(input: {
    id: string;
    category?: FeedingType;
    amountMl?: number;
    recordedAt?: string;
  }) {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Feeding record not found');
    const { id, recordedAt, ...rest } = input;
    return this.repo.update(id, {
      ...rest,
      ...(recordedAt ? { recordedAt: new Date(recordedAt) } : {}),
    });
  }
}
