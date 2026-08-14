import { Inject, Injectable } from '@nestjs/common';
import { PlanType } from '@prisma/client';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../repositories/subscription.repository.interface';
import { AuditService } from '../../shared/services/audit.service';

@Injectable()
export class UpdateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY) private readonly repo: ISubscriptionRepository,
    private readonly auditService: AuditService,
  ) {}

  async execute(input: {
    familyId: string;
    plan: PlanType;
    expiredAt?: string;
    actingUserId: string;
  }) {
    const subscription = await this.repo.upsert(input.familyId, {
      plan: input.plan,
      expiredAt: input.expiredAt ? new Date(input.expiredAt) : null,
    });

    await this.auditService.log({
      userId: input.actingUserId,
      action: 'BILLING_CHANGE',
      entityType: 'Subscription',
      entityId: subscription.id,
      metadata: { plan: input.plan },
    });

    return subscription;
  }
}
