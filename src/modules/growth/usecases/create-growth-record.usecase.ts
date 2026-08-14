import { Inject, Injectable } from '@nestjs/common';
import {
  GROWTH_RECORD_REPOSITORY,
  IGrowthRecordRepository,
} from '../repositories/growth-record.repository.interface';

@Injectable()
export class CreateGrowthRecordUseCase {
  constructor(@Inject(GROWTH_RECORD_REPOSITORY) private readonly repo: IGrowthRecordRepository) {}

  async execute(input: {
    childId: string;
    weightKg?: number;
    heightCm?: number;
    headCircumCm?: number;
    recordedAt: string;
  }) {
    return this.repo.create({
      childId: input.childId,
      weightKg: input.weightKg,
      heightCm: input.heightCm,
      headCircumCm: input.headCircumCm,
      recordedAt: new Date(input.recordedAt),
    });
  }
}
