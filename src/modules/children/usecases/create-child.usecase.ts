import { Inject, Injectable } from '@nestjs/common';
import { FamilyRole } from '@prisma/client';
import {
  CHILD_REPOSITORY,
  CreateChildData,
  IChildRepository,
} from '../repositories/child.repository.interface';
import { FamilyMembershipService } from '../../families/services/family-membership.service';
import { AppException } from '../../../common/utils/app-exception';

const ALLOWED_ROLES: FamilyRole[] = [FamilyRole.OWNER, FamilyRole.PARENT];

@Injectable()
export class CreateChildUseCase {
  constructor(
    @Inject(CHILD_REPOSITORY) private readonly childRepo: IChildRepository,
    private readonly membershipService: FamilyMembershipService,
  ) {}

  async execute(input: CreateChildData & { userId: string }) {
    const { userId, ...data } = input;
    const role = await this.membershipService.assertActiveMember(data.familyId, userId);
    if (!ALLOWED_ROLES.includes(role)) {
      throw AppException.forbidden('Only OWNER or PARENT can add a child');
    }
    return this.childRepo.create(data);
  }
}
