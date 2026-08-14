import { SetMetadata } from '@nestjs/common';
import { FamilyRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Marks the minimum set of FamilyMember roles allowed to call this handler.
 * Must be combined with @UseGuards(JwtAuthGuard, FamilyRolesGuard).
 */
export const Roles = (...roles: FamilyRole[]) => SetMetadata(ROLES_KEY, roles);
