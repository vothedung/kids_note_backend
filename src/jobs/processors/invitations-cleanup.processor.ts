import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { FamilyMembershipService } from '../../modules/families/services/family-membership.service';

const DEFAULT_EXPIRY_DAYS = 14;

@Processor('invitations-cleanup')
export class InvitationsCleanupProcessor {
  private readonly logger = new Logger(InvitationsCleanupProcessor.name);

  constructor(private readonly membershipService: FamilyMembershipService) {}

  @Process('delete-expired-invitations')
  async deleteExpiredInvitations(job: Job<{ olderThanDays?: number }>) {
    const olderThanDays = job.data?.olderThanDays ?? DEFAULT_EXPIRY_DAYS;
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

    const count = await this.membershipService.cleanupExpiredInvitations(cutoff);
    this.logger.log(`Revoked ${count} expired invitation(s)`);
    return { revoked: count };
  }
}
