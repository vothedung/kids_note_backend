import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../repositories/subscription.repository.interface';

@Injectable()
export class GetSubscriptionUseCase {
  constructor(@Inject(SUBSCRIPTION_REPOSITORY) private readonly repo: ISubscriptionRepository) {}

  async execute(input: { familyId: string }) {
    const subscription = await this.repo.findByFamilyId(input.familyId);
    if (!subscription) throw new NotFoundException('Subscription not found');
    return subscription;
  }
}
