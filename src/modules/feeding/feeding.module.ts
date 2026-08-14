import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { FeedingRecordsController } from './controllers/feeding-records.controller';
import { FEEDING_RECORD_REPOSITORY } from './repositories/feeding-record.repository.interface';
import { FeedingRecordPrismaRepository } from './repositories/feeding-record.prisma-repository';
import { CreateFeedingRecordUseCase } from './usecases/create-feeding-record.usecase';
import { ListFeedingRecordsUseCase } from './usecases/list-feeding-records.usecase';
import { UpdateFeedingRecordUseCase } from './usecases/update-feeding-record.usecase';
import { DeleteFeedingRecordUseCase } from './usecases/delete-feeding-record.usecase';
import { GetFeedingAnalyticsUseCase } from './usecases/get-feeding-analytics.usecase';

@Module({
  imports: [ChildrenModule],
  controllers: [FeedingRecordsController],
  providers: [
    { provide: FEEDING_RECORD_REPOSITORY, useClass: FeedingRecordPrismaRepository },
    CreateFeedingRecordUseCase,
    ListFeedingRecordsUseCase,
    UpdateFeedingRecordUseCase,
    DeleteFeedingRecordUseCase,
    GetFeedingAnalyticsUseCase,
  ],
})
export class FeedingModule {}
