import { Injectable } from '@nestjs/common';
import { PlanType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ISubscriptionRepository } from './subscription.repository.interface';
import { SubscriptionEntity } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionPrismaRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByFamilyId(familyId: string): Promise<SubscriptionEntity | null> {
    const record = await this.prisma.subscription.findFirst({
      where: { familyId, deletedAt: null },
    });
    return record ? SubscriptionEntity.fromPrisma(record) : null;
  }

  async upsert(
    familyId: string,
    data: { plan: PlanType; expiredAt?: Date | null },
  ): Promise<SubscriptionEntity> {
    const record = await this.prisma.subscription.upsert({
      where: { familyId },
      create: { familyId, plan: data.plan, expiredAt: data.expiredAt },
      update: { plan: data.plan, expiredAt: data.expiredAt },
    });
    return SubscriptionEntity.fromPrisma(record);
  }
}
