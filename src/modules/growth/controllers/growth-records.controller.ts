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
import { CreateGrowthRecordDto } from '../dtos/create-growth-record.dto';
import { UpdateGrowthRecordDto } from '../dtos/update-growth-record.dto';
import { CreateGrowthRecordUseCase } from '../usecases/create-growth-record.usecase';
import { ListGrowthRecordsUseCase } from '../usecases/list-growth-records.usecase';
import { UpdateGrowthRecordUseCase } from '../usecases/update-growth-record.usecase';
import { DeleteGrowthRecordUseCase } from '../usecases/delete-growth-record.usecase';
import { GetGrowthTrendUseCase } from '../usecases/get-growth-trend.usecase';

const WRITE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT];
const UPDATE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Growth Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:childId/growth-records', version: '1' })
export class GrowthRecordsController {
  constructor(
    private readonly createGrowthRecord: CreateGrowthRecordUseCase,
    private readonly listGrowthRecords: ListGrowthRecordsUseCase,
    private readonly updateGrowthRecord: UpdateGrowthRecordUseCase,
    private readonly deleteGrowthRecord: DeleteGrowthRecordUseCase,
    private readonly getGrowthTrend: GetGrowthTrendUseCase,
  ) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Add a growth record (OWNER, PARENT)' })
  async create(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body() dto: CreateGrowthRecordDto,
  ) {
    return this.createGrowthRecord.execute({ childId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List growth records (cursor pagination)' })
  async findAll(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CursorPaginationDto,
  ) {
    return this.listGrowthRecords.execute({ childId, cursor: query.cursor, limit: query.limit });
  }

  @Get('trend')
  @ApiOperation({ summary: 'Growth trend for charting (weight/height/head over time)' })
  async trend(@Param('childId', ParseUUIDPipe) childId: string, @Query('since') since?: string) {
    return this.getGrowthTrend.execute({ childId, since });
  }

  @Patch(':id')
  @Roles(...UPDATE_ROLES)
  @ApiOperation({ summary: 'Update a growth record (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGrowthRecordDto) {
    return this.updateGrowthRecord.execute({ id, ...dto });
  }

  @Delete(':id')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a growth record (OWNER, PARENT)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteGrowthRecord.execute({ id });
    return { deleted: true };
  }
}
