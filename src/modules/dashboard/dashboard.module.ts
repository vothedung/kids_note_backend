import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { NotesModule } from '../notes/notes.module';
import { GrowthModule } from '../growth/growth.module';
import { SleepModule } from '../sleep/sleep.module';
import { FeedingModule } from '../feeding/feeding.module';
import { VaccinationsModule } from '../vaccinations/vaccinations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { DashboardController } from './controllers/dashboard.controller';
import { GetChildSummaryUseCase } from './usecases/get-child-summary.usecase';
import { GetTodayActivitiesUseCase } from './usecases/get-today-activities.usecase';

/**
 * Read-only aggregation layer for the Dashboard (Home tab). Composes
 * usecases/services already exported by the owning modules — never imports
 * another module's repository directly (see references/02-architecture.md).
 */
@Module({
  imports: [
    ChildrenModule,
    NotesModule,
    GrowthModule,
    SleepModule,
    FeedingModule,
    VaccinationsModule,
    NotificationsModule,
  ],
  controllers: [DashboardController],
  providers: [GetChildSummaryUseCase, GetTodayActivitiesUseCase],
})
export class DashboardModule {}
