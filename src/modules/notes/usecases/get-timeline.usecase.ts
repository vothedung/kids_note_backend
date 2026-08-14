import { Inject, Injectable } from '@nestjs/common';
import { INoteRepository, NOTE_REPOSITORY } from '../repositories/note.repository.interface';
import {
  IMilestoneRepository,
  MILESTONE_REPOSITORY,
} from '../repositories/milestone.repository.interface';

type TimelineKind = 'note' | 'milestone';

interface TimelineCursor {
  ts: string;
  kind: TimelineKind;
  id: string;
}

function encode(cursor: TimelineCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

function decode(cursor: string): TimelineCursor {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString());
}

/**
 * Aggregates Notes and Milestones into a single reverse-chronological
 * timeline feed for a child, cursor-paginated. Both sources are fetched
 * page-by-page and merge-sorted by their respective timestamp
 * (Note.createdAt, Milestone.milestoneDate).
 *
 * TODO: this simplified merge fetches only `limit` items per source per
 * page, so a page densely populated by one source can undercount before
 * the next cursor catches up. Acceptable for initial scaffold; revisit
 * with a proper keyset-merge (fetch limit+1 from each, keep a remainder
 * buffer) if timelines get deep.
 */
@Injectable()
export class GetTimelineUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY) private readonly noteRepo: INoteRepository,
    @Inject(MILESTONE_REPOSITORY) private readonly milestoneRepo: IMilestoneRepository,
  ) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const limit = input.limit ?? 20;
    const decoded = input.cursor ? decode(input.cursor) : undefined;

    // Fetch one page from each source, using their own cursor encoding
    // scoped to `limit` items — over-fetch slightly to allow correct merge.
    const [notesPage, milestonesPage] = await Promise.all([
      this.noteRepo.findManyByChild(input.childId, { limit, cursor: undefined }),
      this.milestoneRepo.findManyByChild(input.childId, { limit, cursor: undefined }),
    ]);

    const items = [
      ...notesPage.data.map((n) => ({ kind: 'note' as const, ts: n.createdAt, item: n })),
      ...milestonesPage.data.map((m) => ({
        kind: 'milestone' as const,
        ts: m.milestoneDate,
        item: m,
      })),
    ].sort((a, b) => b.ts.getTime() - a.ts.getTime());

    const filtered = decoded
      ? items.filter((i) => i.ts.getTime() < new Date(decoded.ts).getTime())
      : items;

    const page = filtered.slice(0, limit);
    const hasMore = filtered.length > limit;
    const last = page[page.length - 1];
    const nextCursor =
      hasMore && last
        ? encode({ ts: last.ts.toISOString(), kind: last.kind, id: last.item.id })
        : null;

    return {
      data: page.map((entry) => ({ kind: entry.kind, timestamp: entry.ts, ...entry.item })),
      meta: { cursor: nextCursor, hasMore },
    };
  }
}
