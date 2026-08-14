import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INoteRepository, NOTE_REPOSITORY } from '../repositories/note.repository.interface';

@Injectable()
export class UpdateNoteUseCase {
  constructor(@Inject(NOTE_REPOSITORY) private readonly repo: INoteRepository) {}

  async execute(input: { id: string; title?: string; content?: string; tags?: string[] }) {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Note not found');
    const { id, ...data } = input;
    return this.repo.update(id, data);
  }
}
