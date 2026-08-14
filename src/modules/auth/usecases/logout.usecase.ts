import { Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { AuditService } from '../../../modules/shared/services/audit.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly auditService: AuditService,
  ) {}

  async execute(input: { userId: string }): Promise<void> {
    await this.tokenService.revokeAllForUser(input.userId);
    await this.auditService.log({
      userId: input.userId,
      action: 'LOGOUT',
      entityType: 'User',
      entityId: input.userId,
    });
  }
}
