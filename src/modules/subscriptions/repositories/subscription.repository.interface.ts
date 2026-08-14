import { PlanType } from '@prisma/client';
import { SubscriptionEntity } from '../entities/subscription.entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');

export interface ISubscriptionRepository {
  findByFamilyId(familyId: string): Promise<SubscriptionEntity | null>;
  upsert(
    familyId: string,
    data: { plan: PlanType; expiredAt?: Date | null },
  ): Promise<SubscriptionEntity>;
}
