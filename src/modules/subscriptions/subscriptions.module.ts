import { Module } from '@nestjs/common';
import { FamiliesModule } from '../families/families.module';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { SUBSCRIPTION_REPOSITORY } from './repositories/subscription.repository.interface';
import { SubscriptionPrismaRepository } from './repositories/subscription.prisma-repository';
import { GetSubscriptionUseCase } from './usecases/get-subscription.usecase';
import { UpdateSubscriptionUseCase } from './usecases/update-subscription.usecase';

@Module({
  imports: [FamiliesModule, SharedModule],
  controllers: [SubscriptionsController],
  providers: [
    { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionPrismaRepository },
    GetSubscriptionUseCase,
    UpdateSubscriptionUseCase,
  ],
})
export class SubscriptionsModule {}
