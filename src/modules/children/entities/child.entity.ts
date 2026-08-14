import { Gender } from '@prisma/client';

export class ChildEntity {
  id: string;
  familyId: string;
  name: string;
  birthday: Date;
  gender: Gender;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): ChildEntity {
    const entity = new ChildEntity();
    Object.assign(entity, record);
    return entity;
  }
}
