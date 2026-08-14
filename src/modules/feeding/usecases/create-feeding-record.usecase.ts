import { Inject, Injectable } from '@nestjs/common';
import {
  FEEDING_RECORD_REPOSITORY,
  IFeedingRecordRepository,
} from '../repositories/feeding-record.repository.interface';
import { FeedingType } from '@prisma/client';

@Injectable()
export class CreateFeedingRecordUseCase {
  constructor(@Inject(FEEDING_RECORD_REPOSITORY) private readonly repo: IFeedingRecordRepository) {}

  async execute(input: {
    childId: string;
    category: FeedingType;
    amountMl?: number;
    recordedAt: string;
  }) {
    return this.repo.create({
      childId: input.childId,
      category: input.category,
      amountMl: input.amountMl,
      recordedAt: new Date(input.recordedAt),
    });
  }
}
