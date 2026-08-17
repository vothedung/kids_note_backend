import { Module } from '@nestjs/common';
import { FamiliesModule } from '../families/families.module';
import { MediaModule } from '../media/media.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { StorageController } from './controllers/storage.controller';
import { GetFamilyStorageUseCase } from './usecases/get-family-storage.usecase';

@Module({
  imports: [FamiliesModule, MediaModule, SubscriptionsModule],
  controllers: [StorageController],
  providers: [GetFamilyStorageUseCase],
})
export class StorageModule {}
