import { Inject, Injectable } from '@nestjs/common';
import {
  GROWTH_RECORD_REPOSITORY,
  IGrowthRecordRepository,
} from '../repositories/growth-record.repository.interface';

/**
 * Returns a chronological growth trend: raw data points plus the delta from
 * the previous record for each metric, ready for a client-side chart.
 */
@Injectable()
export class GetGrowthTrendUseCase {
  constructor(@Inject(GROWTH_RECORD_REPOSITORY) private readonly repo: IGrowthRecordRepository) {}

  async execute(input: { childId: string; since?: string }) {
    const records = await this.repo.findAllByChildSince(
      input.childId,
      input.since ? new Date(input.since) : undefined,
    );

    let prev: (typeof records)[number] | undefined;
    const points = records.map((record) => {
      const point = {
        recordedAt: record.recordedAt,
        weightKg: record.weightKg,
        heightCm: record.heightCm,
        headCircumCm: record.headCircumCm,
        deltaWeightKg:
          prev && record.weightKg != null && prev.weightKg != null
            ? Number((record.weightKg - prev.weightKg).toFixed(2))
            : null,
        deltaHeightCm:
          prev && record.heightCm != null && prev.heightCm != null
            ? Number((record.heightCm - prev.heightCm).toFixed(2))
            : null,
      };
      prev = record;
      return point;
    });

    return { points };
  }
}
