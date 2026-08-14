import { Inject, Injectable } from '@nestjs/common';
import { FamilyRole, MemberStatus } from '@prisma/client';
import { FAMILY_REPOSITORY, IFamilyRepository } from '../repositories/family.repository.interface';
import {
  FAMILY_MEMBER_REPOSITORY,
  IFamilyMemberRepository,
} from '../repositories/family-member.repository.interface';

@Injectable()
export class CreateFamilyUseCase {
  constructor(
    @Inject(FAMILY_REPOSITORY) private readonly familyRepo: IFamilyRepository,
    @Inject(FAMILY_MEMBER_REPOSITORY) private readonly memberRepo: IFamilyMemberRepository,
  ) {}

  async execute(input: { userId: string; name: string }) {
    const family = await this.familyRepo.create({ name: input.name, ownerId: input.userId });
    await this.memberRepo.create({
      familyId: family.id,
      userId: input.userId,
      role: FamilyRole.OWNER,
      status: MemberStatus.ACTIVE,
    });
    return family;
  }
}
