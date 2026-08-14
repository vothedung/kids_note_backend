import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FamilyRole } from '@prisma/client';
import { CHILD_REPOSITORY, IChildRepository } from '../repositories/child.repository.interface';
import { FamilyMembershipService } from '../../families/services/family-membership.service';
import { ChildEntity } from '../entities/child.entity';

/**
 * Public API of the `children` module for cross-module child-scoped access
 * checks. Modules that own child-scoped records (notes, growth, sleep,
 * feeding, vaccinations, media) depend on this service instead of importing
 * the Child repository directly.
 */
@Injectable()
export class ChildAccessService {
  constructor(
    @Inject(CHILD_REPOSITORY) private readonly childRepo: IChildRepository,
    private readonly membershipService: FamilyMembershipService,
  ) {}

  async getChildOrThrow(childId: string): Promise<ChildEntity> {
    const child = await this.childRepo.findById(childId);
    if (!child) throw new NotFoundException('Child not found');
    return child;
  }

  /** Resolves the child's family and returns the user's active role in it. */
  async resolveRole(
    childId: string,
    userId: string,
  ): Promise<{ familyId: string; role: FamilyRole }> {
    const child = await this.getChildOrThrow(childId);
    const role = await this.membershipService.assertActiveMember(child.familyId, userId);
    return { familyId: child.familyId, role };
  }
}
