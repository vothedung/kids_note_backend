import { FamilyRole, MemberStatus } from '@prisma/client';

export class FamilyMemberEntity {
  id: string;
  familyId: string;
  userId: string;
  role: FamilyRole;
  status: MemberStatus;
  invitedEmail?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): FamilyMemberEntity {
    const entity = new FamilyMemberEntity();
    Object.assign(entity, record);
    return entity;
  }
}
