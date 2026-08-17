import { Injectable } from '@nestjs/common';
import { PlanType } from '@prisma/client';
import { UpdateSubscriptionUseCase } from './update-subscription.usecase';

/**
 * Thin wrapper over UpdateSubscriptionUseCase for the "Subscribe"/"Change
 * plan" screen: translates a billing cycle into a concrete expiry date.
 * No real payment provider is integrated yet — this activates the plan
 * immediately (TODO: gate on payment confirmation once one is wired in).
 */
@Injectable()
export class SubscribeUseCase {
  constructor(private readonly updateSubscription: UpdateSubscriptionUseCase) {}

  async execute(input: {
    familyId: string;
    plan: PlanType;
    billingCycle: 'monthly' | 'yearly';
    actingUserId: string;
  }) {
    const days = input.billingCycle === 'yearly' ? 365 : 30;
    const expiredAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    return this.updateSubscription.execute({
      familyId: input.familyId,
      plan: input.plan,
      expiredAt,
      actingUserId: input.actingUserId,
    });
  }
}
