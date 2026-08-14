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
import { CreateFeedingRecordDto } from '../dtos/create-feeding-record.dto';
import { UpdateFeedingRecordDto } from '../dtos/update-feeding-record.dto';
import { CreateFeedingRecordUseCase } from '../usecases/create-feeding-record.usecase';
import { ListFeedingRecordsUseCase } from '../usecases/list-feeding-records.usecase';
import { UpdateFeedingRecordUseCase } from '../usecases/update-feeding-record.usecase';
import { DeleteFeedingRecordUseCase } from '../usecases/delete-feeding-record.usecase';
import { GetFeedingAnalyticsUseCase } from '../usecases/get-feeding-analytics.usecase';

const WRITE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT];
const UPDATE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Feeding Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:childId/feeding-records', version: '1' })
export class FeedingRecordsController {
  constructor(
    private readonly createFeedingRecord: CreateFeedingRecordUseCase,
    private readonly listFeedingRecords: ListFeedingRecordsUseCase,
    private readonly updateFeedingRecord: UpdateFeedingRecordUseCase,
    private readonly deleteFeedingRecord: DeleteFeedingRecordUseCase,
    private readonly getFeedingAnalytics: GetFeedingAnalyticsUseCase,
  ) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Add a feeding record (OWNER, PARENT)' })
  async create(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body() dto: CreateFeedingRecordDto,
  ) {
    return this.createFeedingRecord.execute({ childId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List feeding records (cursor pagination)' })
  async findAll(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CursorPaginationDto,
  ) {
    return this.listFeedingRecords.execute({ childId, cursor: query.cursor, limit: query.limit });
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Feeding analytics (by category, by day)' })
  async analytics(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query('since') since?: string,
  ) {
    return this.getFeedingAnalytics.execute({ childId, since });
  }

  @Patch(':id')
  @Roles(...UPDATE_ROLES)
  @ApiOperation({ summary: 'Update a feeding record (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFeedingRecordDto) {
    return this.updateFeedingRecord.execute({ id, ...dto });
  }

  @Delete(':id')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a feeding record (OWNER, PARENT)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteFeedingRecord.execute({ id });
    return { deleted: true };
  }
}
