import { Inject, Injectable } from '@nestjs/common';
import {
  IMilestoneRepository,
  MILESTONE_REPOSITORY,
} from '../repositories/milestone.repository.interface';

@Injectable()
export class ListMilestonesUseCase {
  constructor(@Inject(MILESTONE_REPOSITORY) private readonly repo: IMilestoneRepository) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const { data, cursor, hasMore } = await this.repo.findManyByChild(input.childId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
