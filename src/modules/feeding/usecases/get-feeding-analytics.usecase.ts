import { Inject, Injectable } from '@nestjs/common';
import {
  FEEDING_RECORD_REPOSITORY,
  IFeedingRecordRepository,
} from '../repositories/feeding-record.repository.interface';

/** Aggregates feeding counts/volume by category and by day. */
@Injectable()
export class GetFeedingAnalyticsUseCase {
  constructor(@Inject(FEEDING_RECORD_REPOSITORY) private readonly repo: IFeedingRecordRepository) {}

  async execute(input: { childId: string; since?: string }) {
    const records = await this.repo.findAllByChildSince(
      input.childId,
      input.since ? new Date(input.since) : undefined,
    );

    const byCategory = new Map<string, { count: number; totalMl: number }>();
    const byDay = new Map<string, number>();

    for (const record of records) {
      const cat = byCategory.get(record.category) ?? { count: 0, totalMl: 0 };
      cat.count += 1;
      cat.totalMl += record.amountMl ?? 0;
      byCategory.set(record.category, cat);

      const day = record.recordedAt.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }

    return {
      totalRecords: records.length,
      byCategory: Array.from(byCategory.entries()).map(([category, v]) => ({
        category,
        count: v.count,
        totalMl: v.totalMl,
      })),
      byDay: Array.from(byDay.entries()).map(([day, count]) => ({ day, count })),
    };
  }
}
