export class FamilyEntity {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): FamilyEntity {
    const entity = new FamilyEntity();
    Object.assign(entity, record);
    return entity;
  }
}
