import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FamilyRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AppException } from '../utils/app-exception';

/**
 * Generic RBAC check. Expects an upstream family-context guard
 * (FamilyAccessGuard in the `families` module, or ChildAccessGuard in the
 * `children` module) to have already resolved and attached `request.familyRole`.
 *
 * If no @Roles() metadata is present, the route is open to any authenticated
 * + family-active member.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<FamilyRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const role: FamilyRole | undefined = request.familyRole;

    if (!role || !requiredRoles.includes(role)) {
      throw AppException.forbidden(`Requires one of roles: ${requiredRoles.join(', ')}`);
    }
    return true;
  }
}
