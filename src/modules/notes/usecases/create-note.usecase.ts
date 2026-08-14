import { Inject, Injectable } from '@nestjs/common';
import { INoteRepository, NOTE_REPOSITORY } from '../repositories/note.repository.interface';

@Injectable()
export class CreateNoteUseCase {
  constructor(@Inject(NOTE_REPOSITORY) private readonly repo: INoteRepository) {}

  async execute(input: {
    childId: string;
    authorId: string;
    title?: string;
    content: string;
    tags?: string[];
  }) {
    return this.repo.create({
      childId: input.childId,
      authorId: input.authorId,
      title: input.title,
      content: input.content,
      tags: input.tags ?? [],
    });
  }
}
