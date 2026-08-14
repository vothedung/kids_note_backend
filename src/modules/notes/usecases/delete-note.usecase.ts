import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INoteRepository, NOTE_REPOSITORY } from '../repositories/note.repository.interface';

@Injectable()
export class DeleteNoteUseCase {
  constructor(@Inject(NOTE_REPOSITORY) private readonly repo: INoteRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Note not found');
    await this.repo.softDelete(input.id);
  }
}
