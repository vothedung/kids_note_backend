import { Inject, Injectable } from '@nestjs/common';
import { INoteRepository, NOTE_REPOSITORY } from '../repositories/note.repository.interface';

@Injectable()
export class ListNotesUseCase {
  constructor(@Inject(NOTE_REPOSITORY) private readonly repo: INoteRepository) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const { data, cursor, hasMore } = await this.repo.findManyByChild(input.childId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
