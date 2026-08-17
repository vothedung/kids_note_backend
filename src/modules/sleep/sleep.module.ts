import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { SleepRecordsController } from './controllers/sleep-records.controller';
import { SLEEP_RECORD_REPOSITORY } from './repositories/sleep-record.repository.interface';
import { SleepRecordPrismaRepository } from './repositories/sleep-record.prisma-repository';
import { CreateSleepRecordUseCase } from './usecases/create-sleep-record.usecase';
import { ListSleepRecordsUseCase } from './usecases/list-sleep-records.usecase';
import { UpdateSleepRecordUseCase } from './usecases/update-sleep-record.usecase';
import { DeleteSleepRecordUseCase } from './usecases/delete-sleep-record.usecase';
import { GetSleepAnalyticsUseCase } from './usecases/get-sleep-analytics.usecase';

@Module({
  imports: [ChildrenModule],
  controllers: [SleepRecordsController],
  providers: [
    { provide: SLEEP_RECORD_REPOSITORY, useClass: SleepRecordPrismaRepository },
    CreateSleepRecordUseCase,
    ListSleepRecordsUseCase,
    UpdateSleepRecordUseCase,
    DeleteSleepRecordUseCase,
    GetSleepAnalyticsUseCase,
  ],
  exports: [ListSleepRecordsUseCase],
})
export class SleepModule {}
