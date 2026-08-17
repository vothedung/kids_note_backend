import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ChildAccessGuard } from '../../children/guards/child-access.guard';
import { GetChildSummaryUseCase } from '../usecases/get-child-summary.usecase';
import { GetTodayActivitiesUseCase } from '../usecases/get-today-activities.usecase';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:id', version: '1' })
export class DashboardController {
  constructor(
    private readonly getChildSummary: GetChildSummaryUseCase,
    private readonly getTodayActivities: GetTodayActivitiesUseCase,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Dashboard summary: child info, latest growth, counts' })
  async summary(@Param('id', ParseUUIDPipe) childId: string) {
    return this.getChildSummary.execute({ childId });
  }

  @Get('activities/today')
  @ApiOperation({ summary: "Today's activities: notes, sleep, feeding merged feed" })
  async activitiesToday(@Param('id', ParseUUIDPipe) childId: string) {
    return this.getTodayActivities.execute({ childId });
  }
}
