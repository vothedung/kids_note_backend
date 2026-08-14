import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ChildAccessGuard } from '../../children/guards/child-access.guard';
import { QueryTimelineDto } from '../dtos/query-timeline.dto';
import { GetTimelineUseCase } from '../usecases/get-timeline.usecase';

@ApiTags('Timeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:id/timeline', version: '1' })
export class TimelineController {
  constructor(private readonly getTimeline: GetTimelineUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Aggregated notes + milestones timeline (cursor pagination)' })
  async get(@Param('id', ParseUUIDPipe) childId: string, @Query() query: QueryTimelineDto) {
    return this.getTimeline.execute({ childId, cursor: query.cursor, limit: query.limit });
  }
}
