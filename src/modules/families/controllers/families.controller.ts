import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FamilyAccessGuard } from '../guards/family-access.guard';
import { CreateFamilyDto } from '../dtos/create-family.dto';
import { UpdateFamilyDto } from '../dtos/update-family.dto';
import { CreateInvitationDto } from '../dtos/create-invitation.dto';
import { UpdateMemberRoleDto } from '../dtos/update-member-role.dto';
import { CreateFamilyUseCase } from '../usecases/create-family.usecase';
import { ListFamiliesUseCase } from '../usecases/list-families.usecase';
import { UpdateFamilyUseCase } from '../usecases/update-family.usecase';
import { CreateInvitationUseCase } from '../usecases/create-invitation.usecase';
import { ListMembersUseCase } from '../usecases/list-members.usecase';
import { UpdateMemberRoleUseCase } from '../usecases/update-member-role.usecase';

@ApiTags('Families')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'families', version: '1' })
export class FamiliesController {
  constructor(
    private readonly createFamily: CreateFamilyUseCase,
    private readonly listFamilies: ListFamiliesUseCase,
    private readonly updateFamily: UpdateFamilyUseCase,
    private readonly createInvitation: CreateInvitationUseCase,
    private readonly listMembers: ListMembersUseCase,
    private readonly updateMemberRole: UpdateMemberRoleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new family (caller becomes OWNER)' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateFamilyDto) {
    return this.createFamily.execute({ userId, name: dto.name });
  }

  @Get()
  @ApiOperation({ summary: 'List families the current user belongs to' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.listFamilies.execute({ userId });
  }

  @Patch(':id')
  @UseGuards(FamilyAccessGuard, RolesGuard)
  @Roles(FamilyRole.OWNER)
  @ApiOperation({ summary: 'Update family name (OWNER only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateFamilyDto) {
    return this.updateFamily.execute({ id, name: dto.name });
  }

  @Post(':id/invitations')
  @UseGuards(FamilyAccessGuard, RolesGuard)
  @Roles(FamilyRole.OWNER, FamilyRole.PARENT)
  @ApiOperation({ summary: 'Invite a member to the family (OWNER, PARENT)' })
  async invite(@Param('id') familyId: string, @Body() dto: CreateInvitationDto) {
    return this.createInvitation.execute({ familyId, email: dto.email, role: dto.role });
  }

  @Get(':id/members')
  @UseGuards(FamilyAccessGuard, RolesGuard)
  @ApiOperation({ summary: 'List family members (any active member)' })
  async members(@Param('id') familyId: string) {
    return this.listMembers.execute({ familyId });
  }

  @Patch(':id/members/:memberId')
  @UseGuards(FamilyAccessGuard, RolesGuard)
  @Roles(FamilyRole.OWNER)
  @ApiOperation({ summary: 'Change a member role (OWNER only)' })
  async changeRole(
    @Param('memberId') memberId: string,
    @CurrentUser('id') actingUserId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.updateMemberRole.execute({ memberId, role: dto.role, actingUserId });
  }
}
