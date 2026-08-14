import { Inject, Injectable } from '@nestjs/common';
import {
  ISleepRecordRepository,
  SLEEP_RECORD_REPOSITORY,
} from '../repositories/sleep-record.repository.interface';

/** Aggregates sleep duration per day and an overall average. */
@Injectable()
export class GetSleepAnalyticsUseCase {
  constructor(@Inject(SLEEP_RECORD_REPOSITORY) private readonly repo: ISleepRecordRepository) {}

  async execute(input: { childId: string; since?: string }) {
    const records = await this.repo.findAllByChildSince(
      input.childId,
      input.since ? new Date(input.since) : undefined,
    );

    const byDay = new Map<string, number>();
    let totalMinutes = 0;
    let completedCount = 0;

    for (const record of records) {
      const duration = record.durationMinutes();
      if (duration == null) continue;
      totalMinutes += duration;
      completedCount += 1;
      const day = record.startedAt.toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + duration);
    }

    return {
      averageDurationMinutes: completedCount > 0 ? Math.round(totalMinutes / completedCount) : 0,
      totalRecords: records.length,
      byDay: Array.from(byDay.entries()).map(([day, minutes]) => ({ day, totalMinutes: minutes })),
    };
  }
}
