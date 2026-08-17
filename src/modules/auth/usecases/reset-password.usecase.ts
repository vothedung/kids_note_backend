import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { TokenService } from '../services/token.service';
import { AuditService } from '../../shared/services/audit.service';
import {
  IPasswordResetTokenRepository,
  PASSWORD_RESET_TOKEN_REPOSITORY,
} from '../repositories/password-reset-token.repository.interface';

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly auditService: AuditService,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly resetTokenRepo: IPasswordResetTokenRepository,
  ) {}

  async execute(input: ResetPasswordInput): Promise<{ success: true }> {
    const tokenHash = createHash('sha256').update(input.token).digest('hex');
    const stored = await this.resetTokenRepo.findByTokenHash(tokenHash);

    if (!stored || !stored.isValid()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await this.usersService.updatePasswordHash(stored.userId, passwordHash);
    await this.resetTokenRepo.markUsed(stored.id);

    // Revoke all sessions — a password reset should invalidate every
    // previously issued refresh token.
    await this.tokenService.revokeAllForUser(stored.userId);

    await this.auditService.log({
      userId: stored.userId,
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: stored.userId,
    });

    return { success: true };
  }
}
