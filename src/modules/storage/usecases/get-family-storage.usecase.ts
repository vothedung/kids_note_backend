import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanType } from '@prisma/client';
import { GetFamilyStorageUsageUseCase } from '../../media/usecases/get-family-storage-usage.usecase';
import { GetSubscriptionUseCase } from '../../subscriptions/usecases/get-subscription.usecase';

const GIB = 1024 * 1024 * 1024;

const PLAN_QUOTA_BYTES: Record<PlanType, number> = {
  [PlanType.FREE]: 1 * GIB,
  [PlanType.PREMIUM]: 50 * GIB,
  [PlanType.FAMILY]: 50 * GIB,
  [PlanType.AI_ADDON]: 50 * GIB,
};

/**
 * Storage usage for the Settings > Storage screen. Combines the Media
 * module's byte totals with the family's plan quota. Notes/text content is
 * negligible and not counted toward the byte quota.
 */
@Injectable()
export class GetFamilyStorageUseCase {
  constructor(
    private readonly getStorageUsage: GetFamilyStorageUsageUseCase,
    private readonly getSubscription: GetSubscriptionUseCase,
  ) {}

  async execute(input: { familyId: string }) {
    const { photosBytes, videosBytes } = await this.getStorageUsage.execute({
      familyId: input.familyId,
    });

    let plan: PlanType = PlanType.FREE;
    try {
      const subscription = await this.getSubscription.execute({ familyId: input.familyId });
      plan = subscription.plan;
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
      // No subscription row yet — family defaults to the FREE plan.
    }

    const usedBytes = photosBytes + videosBytes;
    const limitBytes = PLAN_QUOTA_BYTES[plan];

    return {
      plan,
      usedBytes,
      limitBytes,
      usedPercent: limitBytes > 0 ? Math.round((usedBytes / limitBytes) * 1000) / 10 : 0,
      breakdown: { photosBytes, videosBytes },
    };
  }
}
