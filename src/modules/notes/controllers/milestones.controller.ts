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
import { CreateMilestoneDto } from '../dtos/create-milestone.dto';
import { UpdateMilestoneDto } from '../dtos/update-milestone.dto';
import { CreateMilestoneUseCase } from '../usecases/create-milestone.usecase';
import { ListMilestonesUseCase } from '../usecases/list-milestones.usecase';
import { UpdateMilestoneUseCase } from '../usecases/update-milestone.usecase';
import { DeleteMilestoneUseCase } from '../usecases/delete-milestone.usecase';

const WRITE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Milestones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:childId/milestones', version: '1' })
export class MilestonesController {
  constructor(
    private readonly createMilestone: CreateMilestoneUseCase,
    private readonly listMilestones: ListMilestonesUseCase,
    private readonly updateMilestone: UpdateMilestoneUseCase,
    private readonly deleteMilestone: DeleteMilestoneUseCase,
  ) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Create a milestone (OWNER, PARENT, CAREGIVER)' })
  async create(@Param('childId', ParseUUIDPipe) childId: string, @Body() dto: CreateMilestoneDto) {
    return this.createMilestone.execute({ childId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List milestones (cursor pagination)' })
  async findAll(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CursorPaginationDto,
  ) {
    return this.listMilestones.execute({ childId, cursor: query.cursor, limit: query.limit });
  }

  @Patch(':milestoneId')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Update a milestone (OWNER, PARENT, CAREGIVER)' })
  async update(
    @Param('milestoneId', ParseUUIDPipe) milestoneId: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    return this.updateMilestone.execute({ id: milestoneId, ...dto });
  }

  @Delete(':milestoneId')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a milestone (OWNER, PARENT, CAREGIVER)' })
  async remove(@Param('milestoneId', ParseUUIDPipe) milestoneId: string) {
    await this.deleteMilestone.execute({ id: milestoneId });
    return { deleted: true };
  }
}
