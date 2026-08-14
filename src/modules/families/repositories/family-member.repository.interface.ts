import { FamilyRole, MemberStatus } from '@prisma/client';
import { FamilyMemberEntity } from '../entities/family-member.entity';

export const FAMILY_MEMBER_REPOSITORY = Symbol('FAMILY_MEMBER_REPOSITORY');

export interface IFamilyMemberRepository {
  findById(id: string): Promise<FamilyMemberEntity | null>;
  findByFamilyAndUser(familyId: string, userId: string): Promise<FamilyMemberEntity | null>;
  findManyByFamily(familyId: string): Promise<FamilyMemberEntity[]>;
  create(data: {
    familyId: string;
    userId: string;
    role: FamilyRole;
    status: MemberStatus;
    invitedEmail?: string | null;
  }): Promise<FamilyMemberEntity>;
  updateRole(id: string, role: FamilyRole): Promise<FamilyMemberEntity>;
  updateStatus(id: string, status: MemberStatus): Promise<FamilyMemberEntity>;
  softDelete(id: string): Promise<void>;
  deleteExpiredInvitations(olderThan: Date): Promise<number>;
}
