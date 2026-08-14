import { NoteEntity } from '../entities/note.entity';

export const NOTE_REPOSITORY = Symbol('NOTE_REPOSITORY');

export interface CreateNoteData {
  childId: string;
  authorId: string;
  title?: string | null;
  content: string;
  tags: string[];
}

export interface INoteRepository {
  findById(id: string): Promise<NoteEntity | null>;
  findManyByChild(
    childId: string,
    params: { cursor?: string; limit: number },
  ): Promise<{ data: NoteEntity[]; cursor: string | null; hasMore: boolean }>;
  create(data: CreateNoteData): Promise<NoteEntity>;
  update(id: string, data: Partial<CreateNoteData>): Promise<NoteEntity>;
  softDelete(id: string): Promise<void>;
}
