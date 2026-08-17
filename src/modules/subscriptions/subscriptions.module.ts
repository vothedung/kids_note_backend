import { Module } from '@nestjs/common';
import { FamiliesModule } from '../families/families.module';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { BillingController } from './controllers/billing.controller';
import { SUBSCRIPTION_REPOSITORY } from './repositories/subscription.repository.interface';
import { SubscriptionPrismaRepository } from './repositories/subscription.prisma-repository';
import { GetSubscriptionUseCase } from './usecases/get-subscription.usecase';
import { UpdateSubscriptionUseCase } from './usecases/update-subscription.usecase';
import { GetBillingPlansUseCase } from './usecases/get-billing-plans.usecase';
import { SubscribeUseCase } from './usecases/subscribe.usecase';
import { GetBillingInvoicesUseCase } from './usecases/get-billing-invoices.usecase';

@Module({
  imports: [FamiliesModule, SharedModule],
  controllers: [SubscriptionsController, BillingController],
  providers: [
    { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionPrismaRepository },
    GetSubscriptionUseCase,
    UpdateSubscriptionUseCase,
    GetBillingPlansUseCase,
    SubscribeUseCase,
    GetBillingInvoicesUseCase,
  ],
  exports: [GetSubscriptionUseCase],
})
export class SubscriptionsModule {}
