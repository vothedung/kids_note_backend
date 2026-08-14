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
import { CreateVaccinationDto } from '../dtos/create-vaccination.dto';
import { UpdateVaccinationDto } from '../dtos/update-vaccination.dto';
import { ReminderSettingsDto } from '../dtos/reminder-settings.dto';
import { CreateVaccinationUseCase } from '../usecases/create-vaccination.usecase';
import { ListVaccinationsUseCase } from '../usecases/list-vaccinations.usecase';
import { UpdateVaccinationUseCase } from '../usecases/update-vaccination.usecase';
import { DeleteVaccinationUseCase } from '../usecases/delete-vaccination.usecase';
import { UpdateReminderSettingsUseCase } from '../usecases/update-reminder-settings.usecase';

const WRITE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT];
const UPDATE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Vaccinations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:childId/vaccinations', version: '1' })
export class VaccinationsController {
  constructor(
    private readonly createVaccination: CreateVaccinationUseCase,
    private readonly listVaccinations: ListVaccinationsUseCase,
    private readonly updateVaccination: UpdateVaccinationUseCase,
    private readonly deleteVaccination: DeleteVaccinationUseCase,
    private readonly updateReminderSettings: UpdateReminderSettingsUseCase,
  ) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Add a vaccination record (OWNER, PARENT)' })
  async create(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body() dto: CreateVaccinationDto,
  ) {
    return this.createVaccination.execute({ childId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List vaccinations (cursor pagination)' })
  async findAll(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CursorPaginationDto,
  ) {
    return this.listVaccinations.execute({ childId, cursor: query.cursor, limit: query.limit });
  }

  // NOTE: must be declared before the ':id' patch route so it takes priority.
  @Patch('reminder-settings')
  @Roles(...UPDATE_ROLES)
  @ApiOperation({ summary: 'Update vaccination reminder settings for a child' })
  async reminderSettings(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Body() dto: ReminderSettingsDto,
  ) {
    return this.updateReminderSettings.execute({ childId, ...dto });
  }

  @Patch(':id')
  @Roles(...UPDATE_ROLES)
  @ApiOperation({ summary: 'Update a vaccination record (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVaccinationDto) {
    return this.updateVaccination.execute({ id, ...dto });
  }

  @Delete(':id')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a vaccination record (OWNER, PARENT)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteVaccination.execute({ id });
    return { deleted: true };
  }
}
