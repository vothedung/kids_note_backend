import { PlanType } from '@prisma/client';

export class SubscriptionEntity {
  id: string;
  familyId: string;
  plan: PlanType;
  startedAt: Date;
  expiredAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): SubscriptionEntity {
    const entity = new SubscriptionEntity();
    Object.assign(entity, record);
    return entity;
  }
}
