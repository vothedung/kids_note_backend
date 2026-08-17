import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { FamilyAccessGuard } from '../../families/guards/family-access.guard';
import { GetFamilyStorageUseCase } from '../usecases/get-family-storage.usecase';

@ApiTags('Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyAccessGuard, RolesGuard)
@Controller({ path: 'families/:id/storage', version: '1' })
export class StorageController {
  constructor(private readonly getFamilyStorage: GetFamilyStorageUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Storage usage and quota for a family (any active member)' })
  async get(@Param('id') familyId: string) {
    return this.getFamilyStorage.execute({ familyId });
  }
}
