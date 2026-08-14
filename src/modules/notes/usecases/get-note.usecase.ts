import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INoteRepository, NOTE_REPOSITORY } from '../repositories/note.repository.interface';

@Injectable()
export class GetNoteUseCase {
  constructor(@Inject(NOTE_REPOSITORY) private readonly repo: INoteRepository) {}

  async execute(input: { id: string }) {
    const note = await this.repo.findById(input.id);
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }
}
