import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FamilyRole } from '@prisma/client';
import {
  FAMILY_MEMBER_REPOSITORY,
  IFamilyMemberRepository,
} from '../repositories/family-member.repository.interface';
import { AuditService } from '../../shared/services/audit.service';

@Injectable()
export class UpdateMemberRoleUseCase {
  constructor(
    @Inject(FAMILY_MEMBER_REPOSITORY) private readonly memberRepo: IFamilyMemberRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(input: { memberId: string; role: FamilyRole; actingUserId: string }) {
    const member = await this.memberRepo.findById(input.memberId);
    if (!member) throw new NotFoundException('Family member not found');

    const updated = await this.memberRepo.updateRole(input.memberId, input.role);

    await this.auditService.log({
      userId: input.actingUserId,
      action: 'PERMISSION_CHANGE',
      entityType: 'FamilyMember',
      entityId: input.memberId,
      metadata: { oldRole: member.role, newRole: input.role },
    });

    return updated;
  }
}
