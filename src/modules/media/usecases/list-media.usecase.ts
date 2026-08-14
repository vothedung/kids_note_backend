import { Inject, Injectable } from '@nestjs/common';
import { IMediaRepository, MEDIA_REPOSITORY } from '../repositories/media.repository.interface';

@Injectable()
export class ListMediaUseCase {
  constructor(@Inject(MEDIA_REPOSITORY) private readonly repo: IMediaRepository) {}

  async execute(input: { childId: string; groupBy?: 'year' | 'month' }) {
    const items = await this.repo.findAllByChild(input.childId);

    if (!input.groupBy) {
      return { data: items, meta: { hasMore: false } };
    }

    const groups = new Map<string, typeof items>();
    for (const item of items) {
      const key =
        input.groupBy === 'year'
          ? String(item.takenAt.getFullYear())
          : `${item.takenAt.getFullYear()}-${String(item.takenAt.getMonth() + 1).padStart(2, '0')}`;
      const bucket = groups.get(key) ?? [];
      bucket.push(item);
      groups.set(key, bucket);
    }

    const data = Array.from(groups.entries())
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([group, media]) => ({ group, media }));

    return { data, meta: { hasMore: false } };
  }
}
