import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  GROWTH_RECORD_REPOSITORY,
  IGrowthRecordRepository,
} from '../repositories/growth-record.repository.interface';

@Injectable()
export class DeleteGrowthRecordUseCase {
  constructor(@Inject(GROWTH_RECORD_REPOSITORY) private readonly repo: IGrowthRecordRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Growth record not found');
    await this.repo.softDelete(input.id);
  }
}
