import { Injectable } from '@nestjs/common';
import { VaccineStatus } from '@prisma/client';
import { GetChildUseCase } from '../../children/usecases/get-child.usecase';
import { GetGrowthTrendUseCase } from '../../growth/usecases/get-growth-trend.usecase';
import { ListVaccinationsUseCase } from '../../vaccinations/usecases/list-vaccinations.usecase';
import { NotificationsService } from '../../notifications/services/notifications.service';

/**
 * Aggregation read-model for the Dashboard (Home tab): child info, latest
 * growth measurement, upcoming vaccination count, unread notification count.
 * Combines existing per-domain usecases/services rather than touching other
 * modules' repositories directly.
 */
@Injectable()
export class GetChildSummaryUseCase {
  constructor(
    private readonly getChild: GetChildUseCase,
    private readonly getGrowthTrend: GetGrowthTrendUseCase,
    private readonly listVaccinations: ListVaccinationsUseCase,
    private readonly notificationsService: NotificationsService,
  ) {}

  async execute(input: { childId: string }) {
    const child = await this.getChild.execute({ id: input.childId });

    const [growthTrend, vaccinationsPage, unreadNotifications] = await Promise.all([
      this.getGrowthTrend.execute({ childId: input.childId }),
      // NOTE: caps at the first 100 vaccination records (cursor-paginated
      // usecase, no server-side status filter yet); fine for typical child
      // vaccine schedules, revisit with a dedicated count query if needed.
      this.listVaccinations.execute({ childId: input.childId, limit: 100 }),
      this.notificationsService.countUnread(child.familyId),
    ]);

    const latestGrowth = growthTrend.points[growthTrend.points.length - 1] ?? null;
    const upcomingVaccinations = vaccinationsPage.data.filter(
      (v: { status: VaccineStatus }) => v.status === VaccineStatus.UPCOMING,
    ).length;

    return {
      child,
      latestGrowth,
      upcomingVaccinationsCount: upcomingVaccinations,
      unreadNotificationsCount: unreadNotifications,
    };
  }
}
