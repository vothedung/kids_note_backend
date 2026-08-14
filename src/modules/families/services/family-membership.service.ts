import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FamilyRole, MemberStatus } from '@prisma/client';
import {
  FAMILY_MEMBER_REPOSITORY,
  IFamilyMemberRepository,
} from '../repositories/family-member.repository.interface';
import { FAMILY_REPOSITORY, IFamilyRepository } from '../repositories/family.repository.interface';
import { AppException } from '../../../common/utils/app-exception';

/**
 * Public API of the `families` module for cross-module RBAC checks.
 * Other modules (children, notes, growth, ...) must depend on this service
 * instead of importing FamilyMember/Family repositories directly.
 */
@Injectable()
export class FamilyMembershipService {
  constructor(
    @Inject(FAMILY_MEMBER_REPOSITORY) private readonly memberRepo: IFamilyMemberRepository,
    @Inject(FAMILY_REPOSITORY) private readonly familyRepo: IFamilyRepository,
  ) {}

  /** Returns the active role of `userId` within `familyId`, or null. */
  async getActiveRole(familyId: string, userId: string): Promise<FamilyRole | null> {
    const member = await this.memberRepo.findByFamilyAndUser(familyId, userId);
    if (!member || member.status !== MemberStatus.ACTIVE) return null;
    return member.role;
  }

  /** Throws 403 if the user is not an active member of the family. */
  async assertActiveMember(familyId: string, userId: string): Promise<FamilyRole> {
    const role = await this.getActiveRole(familyId, userId);
    if (!role) {
      throw AppException.forbidden('You are not an active member of this family');
    }
    return role;
  }

  async assertFamilyExists(familyId: string) {
    const family = await this.familyRepo.findById(familyId);
    if (!family) {
      throw new NotFoundException('Family not found');
    }
    return family;
  }

  async assertOwnerOrForbidden(familyId: string, userId: string) {
    const role = await this.assertActiveMember(familyId, userId);
    if (role !== FamilyRole.OWNER) {
      throw AppException.forbidden('Only the family owner can perform this action');
    }
    return role;
  }

  /** Revokes PENDING invitations older than `olderThan`. Used by the BullMQ cleanup job. */
  async cleanupExpiredInvitations(olderThan: Date): Promise<number> {
    return this.memberRepo.deleteExpiredInvitations(olderThan);
  }
}
