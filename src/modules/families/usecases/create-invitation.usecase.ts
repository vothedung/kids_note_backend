import { Inject, Injectable } from '@nestjs/common';
import { FamilyRole, MemberStatus } from '@prisma/client';
import {
  FAMILY_MEMBER_REPOSITORY,
  IFamilyMemberRepository,
} from '../repositories/family-member.repository.interface';
import { UsersService } from '../../users/services/users.service';
import { AppException } from '../../../common/utils/app-exception';
import { ErrorCode } from '../../../common/utils/error-codes';

@Injectable()
export class CreateInvitationUseCase {
  constructor(
    @Inject(FAMILY_MEMBER_REPOSITORY) private readonly memberRepo: IFamilyMemberRepository,
    private readonly usersService: UsersService,
  ) {}

  async execute(input: { familyId: string; email: string; role: FamilyRole }) {
    const invitee = await this.usersService.findByEmail(input.email);

    if (invitee) {
      const existing = await this.memberRepo.findByFamilyAndUser(input.familyId, invitee.id);
      if (existing) {
        throw AppException.conflict(
          ErrorCode.INVITATION_ALREADY_EXISTS,
          'This user is already a member or has a pending invitation',
        );
      }
    }

    return this.memberRepo.create({
      familyId: input.familyId,
      userId: invitee?.id ?? '',
      role: input.role,
      status: MemberStatus.PENDING,
      invitedEmail: input.email,
    });
  }
}
