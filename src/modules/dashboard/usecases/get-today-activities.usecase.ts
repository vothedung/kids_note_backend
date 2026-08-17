import { Injectable } from '@nestjs/common';
import { ListNotesUseCase } from '../../notes/usecases/list-notes.usecase';
import { ListSleepRecordsUseCase } from '../../sleep/usecases/list-sleep-records.usecase';
import { ListFeedingRecordsUseCase } from '../../feeding/usecases/list-feeding-records.usecase';

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth() === now.getUTCMonth() &&
    date.getUTCDate() === now.getUTCDate()
  );
}

/**
 * "Today's activities" for the Dashboard: notes, sleep, and feeding records
 * created/recorded today, merged and sorted reverse-chronologically.
 * NOTE: filters the most recent 50 records per source client-side rather
 * than querying by date range server-side — acceptable at typical daily
 * volumes, revisit with a dedicated date-range repository method if needed.
 */
@Injectable()
export class GetTodayActivitiesUseCase {
  constructor(
    private readonly listNotes: ListNotesUseCase,
    private readonly listSleepRecords: ListSleepRecordsUseCase,
    private readonly listFeedingRecords: ListFeedingRecordsUseCase,
  ) {}

  async execute(input: { childId: string }) {
    const [notes, sleep, feeding] = await Promise.all([
      this.listNotes.execute({ childId: input.childId, limit: 50 }),
      this.listSleepRecords.execute({ childId: input.childId, limit: 50 }),
      this.listFeedingRecords.execute({ childId: input.childId, limit: 50 }),
    ]);

    const items = [
      ...notes.data
        .filter((n: { createdAt: Date }) => isToday(n.createdAt))
        .map((n: { createdAt: Date }) => ({ kind: 'note' as const, timestamp: n.createdAt, ...n })),
      ...sleep.data
        .filter((s: { startedAt: Date }) => isToday(s.startedAt))
        .map((s: { startedAt: Date }) => ({
          kind: 'sleep' as const,
          timestamp: s.startedAt,
          ...s,
        })),
      ...feeding.data
        .filter((f: { recordedAt: Date }) => isToday(f.recordedAt))
        .map((f: { recordedAt: Date }) => ({
          kind: 'feeding' as const,
          timestamp: f.recordedAt,
          ...f,
        })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return { data: items };
  }
}
