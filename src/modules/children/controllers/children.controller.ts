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
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ChildAccessGuard } from '../guards/child-access.guard';
import { CreateChildForFamilyDto } from '../dtos/create-child-for-family.dto';
import { UpdateChildDto } from '../dtos/update-child.dto';
import { QueryChildrenDto } from '../dtos/query-children.dto';
import { CreateChildUseCase } from '../usecases/create-child.usecase';
import { GetChildUseCase } from '../usecases/get-child.usecase';
import { ListChildrenUseCase } from '../usecases/list-children.usecase';
import { UpdateChildUseCase } from '../usecases/update-child.usecase';
import { DeleteChildUseCase } from '../usecases/delete-child.usecase';

@ApiTags('Children')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'children', version: '1' })
export class ChildrenController {
  constructor(
    private readonly createChild: CreateChildUseCase,
    private readonly getChild: GetChildUseCase,
    private readonly listChildren: ListChildrenUseCase,
    private readonly updateChild: UpdateChildUseCase,
    private readonly deleteChild: DeleteChildUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a child to a family (OWNER, PARENT)' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateChildForFamilyDto) {
    return this.createChild.execute({
      userId,
      familyId: dto.familyId,
      name: dto.name,
      birthday: new Date(dto.birthday),
      gender: dto.gender,
      avatarUrl: dto.avatarUrl,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List children in a family (any active member)' })
  async findAll(@CurrentUser('id') userId: string, @Query() query: QueryChildrenDto) {
    return this.listChildren.execute({ familyId: query.familyId, userId });
  }

  @Get(':id')
  @UseGuards(ChildAccessGuard, RolesGuard)
  @ApiOperation({ summary: 'Get a child by ID (any active family member)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getChild.execute({ id });
  }

  @Patch(':id')
  @UseGuards(ChildAccessGuard, RolesGuard)
  @Roles(FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER)
  @ApiOperation({ summary: 'Update a child (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateChildDto) {
    return this.updateChild.execute({
      id,
      ...dto,
      birthday: dto.birthday ? new Date(dto.birthday) : undefined,
    });
  }

  @Delete(':id')
  @UseGuards(ChildAccessGuard, RolesGuard)
  @Roles(FamilyRole.OWNER, FamilyRole.PARENT)
  @ApiOperation({ summary: 'Soft-delete a child (OWNER, PARENT)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteChild.execute({ id });
    return { deleted: true };
  }
}
