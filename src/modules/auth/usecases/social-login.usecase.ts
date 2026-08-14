import { Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import { UsersService } from '../../users/services/users.service';
import { TokenService } from '../services/token.service';
import { AuditService } from '../../../modules/shared/services/audit.service';

export interface SocialLoginInput {
  provider: AuthProvider;
  providerId: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
}

/**
 * Find-or-create by (provider, providerId). Falls back to matching by email
 * so a user who first registered locally can link a social account.
 */
@Injectable()
export class SocialLoginUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly auditService: AuditService,
  ) {}

  async execute(input: SocialLoginInput) {
    let user = await this.usersService.findByProvider(input.provider, input.providerId);

    if (!user && input.email) {
      user = await this.usersService.findByEmail(input.email);
    }

    if (!user) {
      user = await this.usersService.createUser({
        email: input.email ?? `${input.providerId}@${input.provider.toLowerCase()}.placeholder`,
        fullName: input.fullName ?? 'New User',
        avatarUrl: input.avatarUrl,
        provider: input.provider,
        providerId: input.providerId,
      });
    }

    const tokens = await this.tokenService.generateTokenPair(user);
    await this.auditService.log({
      userId: user.id,
      action: 'SOCIAL_LOGIN',
      entityType: 'User',
      entityId: user.id,
      metadata: { provider: input.provider },
    });

    return { user: user.toPublic(), ...tokens };
  }
}
