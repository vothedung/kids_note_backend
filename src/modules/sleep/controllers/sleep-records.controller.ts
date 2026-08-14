import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ChildAccessGuard } from '../../children/guards/child-access.guard';
import { CursorPaginationDto } from '../../../common/dtos/pagination.dto';
import { CreateSleepRecordDto } from '../dtos/create-sleep-record.dto';
import { UpdateSleepRecordDto } from '../dtos/update-sleep-record.dto';
import { CreateSleepRecordUseCase } from '../usecases/create-sleep-record.usecase';
import { ListSleepRecordsUseCase } from '../usecases/list-sleep-records.usecase';
import { UpdateSleepRecordUseCase } from '../usecases/update-sleep-record.usecase';
import { DeleteSleepRecordUseCase } from '../usecases/delete-sleep-record.usecase';
import { GetSleepAnalyticsUseCase } from '../usecases/get-sleep-analytics.usecase';

const WRITE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT];
const UPDATE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Sleep Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:childId/sleep-records', version: '1' })
export class SleepRecordsController {
  constructor(
    private readonly createSleepRecord: CreateSleepRecordUseCase,
    private readonly listSleepRecords: ListSleepRecordsUseCase,
    private readonly updateSleepRecord: UpdateSleepRecordUseCase,
    private readonly deleteSleepRecord: DeleteSleepRecordUseCase,
    private readonly getSleepAnalytics: GetSleepAnalyticsUseCase,
  ) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Add a sleep record (OWNER, PARENT)' })
  async create(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body() dto: CreateSleepRecordDto,
  ) {
    return this.createSleepRecord.execute({ childId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List sleep records (cursor pagination)' })
  async findAll(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CursorPaginationDto,
  ) {
    return this.listSleepRecords.execute({ childId, cursor: query.cursor, limit: query.limit });
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Sleep analytics (avg duration, per-day totals)' })
  async analytics(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query('since') since?: string,
  ) {
    return this.getSleepAnalytics.execute({ childId, since });
  }

  @Patch(':id')
  @Roles(...UPDATE_ROLES)
  @ApiOperation({ summary: 'Update a sleep record (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSleepRecordDto) {
    return this.updateSleepRecord.execute({ id, ...dto });
  }

  @Delete(':id')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a sleep record (OWNER, PARENT)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteSleepRecord.execute({ id });
    return { deleted: true };
  }
}
