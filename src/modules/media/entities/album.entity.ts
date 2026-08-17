export class AlbumEntity {
  id: string;
  childId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): AlbumEntity {
    const entity = new AlbumEntity();
    Object.assign(entity, record);
    return entity;
  }
}
