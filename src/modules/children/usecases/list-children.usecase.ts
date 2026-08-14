import { Inject, Injectable } from '@nestjs/common';
import { CHILD_REPOSITORY, IChildRepository } from '../repositories/child.repository.interface';
import { FamilyMembershipService } from '../../families/services/family-membership.service';

@Injectable()
export class ListChildrenUseCase {
  constructor(
    @Inject(CHILD_REPOSITORY) private readonly childRepo: IChildRepository,
    private readonly membershipService: FamilyMembershipService,
  ) {}

  async execute(input: { familyId: string; userId: string }) {
    await this.membershipService.assertActiveMember(input.familyId, input.userId);
    const data = await this.childRepo.findManyByFamily(input.familyId);
    return { data, meta: { hasMore: false } };
  }
}
