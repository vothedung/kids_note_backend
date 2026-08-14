export const NOTE_TAGS = ['Feeding', 'Sleep', 'Milestone', 'Health', 'Fun'] as const;
export type NoteTag = (typeof NOTE_TAGS)[number];

export class NoteEntity {
  id: string;
  childId: string;
  authorId: string;
  title?: string | null;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): NoteEntity {
    const entity = new NoteEntity();
    Object.assign(entity, record);
    return entity;
  }
}
