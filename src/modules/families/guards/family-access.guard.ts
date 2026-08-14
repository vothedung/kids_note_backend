import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FamilyMembershipService } from '../services/family-membership.service';

/**
 * Resolves the current user's role within the family identified by the
 * `:id` (or `:familyId`) route param and attaches it to `request.familyRole`
 * for the generic RolesGuard to check against @Roles() metadata.
 *
 * Apply on all direct /families/:id/... routes, ahead of RolesGuard.
 */
@Injectable()
export class FamilyAccessGuard implements CanActivate {
  constructor(private readonly membershipService: FamilyMembershipService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const familyId = request.params.familyId ?? request.params.id;
    const userId = request.user?.id;

    const role = await this.membershipService.assertActiveMember(familyId, userId);
    request.familyId = familyId;
    request.familyRole = role;
    return true;
  }
}
