import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  GROWTH_RECORD_REPOSITORY,
  IGrowthRecordRepository,
} from '../repositories/growth-record.repository.interface';

@Injectable()
export class UpdateGrowthRecordUseCase {
  constructor(@Inject(GROWTH_RECORD_REPOSITORY) private readonly repo: IGrowthRecordRepository) {}

  async execute(input: {
    id: string;
    weightKg?: number;
    heightCm?: number;
    headCircumCm?: number;
    recordedAt?: string;
  }) {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Growth record not found');
    const { id, recordedAt, ...rest } = input;
    return this.repo.update(id, {
      ...rest,
      ...(recordedAt ? { recordedAt: new Date(recordedAt) } : {}),
    });
  }
}
