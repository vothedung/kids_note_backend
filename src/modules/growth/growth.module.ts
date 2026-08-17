import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { GrowthRecordsController } from './controllers/growth-records.controller';
import { GROWTH_RECORD_REPOSITORY } from './repositories/growth-record.repository.interface';
import { GrowthRecordPrismaRepository } from './repositories/growth-record.prisma-repository';
import { CreateGrowthRecordUseCase } from './usecases/create-growth-record.usecase';
import { ListGrowthRecordsUseCase } from './usecases/list-growth-records.usecase';
import { UpdateGrowthRecordUseCase } from './usecases/update-growth-record.usecase';
import { DeleteGrowthRecordUseCase } from './usecases/delete-growth-record.usecase';
import { GetGrowthTrendUseCase } from './usecases/get-growth-trend.usecase';

@Module({
  imports: [ChildrenModule],
  controllers: [GrowthRecordsController],
  providers: [
    { provide: GROWTH_RECORD_REPOSITORY, useClass: GrowthRecordPrismaRepository },
    CreateGrowthRecordUseCase,
    ListGrowthRecordsUseCase,
    UpdateGrowthRecordUseCase,
    DeleteGrowthRecordUseCase,
    GetGrowthTrendUseCase,
  ],
  exports: [GetGrowthTrendUseCase],
})
export class GrowthModule {}
