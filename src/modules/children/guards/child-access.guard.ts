import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChildAccessService } from '../services/child-access.service';

/**
 * Resolves the current user's role within the family that owns the child
 * identified by the `:childId` (or `:id`, for direct /children/:id routes)
 * route param, and attaches it to `request.familyRole` for the generic
 * RolesGuard. Apply on every child-scoped route (children, notes,
 * milestones, media, growth, sleep, feeding, vaccinations), ahead of
 * RolesGuard.
 */
@Injectable()
export class ChildAccessGuard implements CanActivate {
  constructor(private readonly childAccessService: ChildAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const childId = request.params.childId ?? request.params.id;
    const userId = request.user?.id;

    const { familyId, role } = await this.childAccessService.resolveRole(childId, userId);
    request.familyId = familyId;
    request.familyRole = role;
    request.childId = childId;
    return true;
  }
}
