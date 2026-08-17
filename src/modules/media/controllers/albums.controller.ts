import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ChildAccessGuard } from '../../children/guards/child-access.guard';
import { CreateAlbumDto } from '../dtos/create-album.dto';
import { CreateAlbumUseCase } from '../usecases/create-album.usecase';
import { ListAlbumsUseCase } from '../usecases/list-albums.usecase';

const CREATE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Albums')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:id/albums', version: '1' })
export class AlbumsController {
  constructor(
    private readonly createAlbum: CreateAlbumUseCase,
    private readonly listAlbums: ListAlbumsUseCase,
  ) {}

  @Post()
  @Roles(...CREATE_ROLES)
  @ApiOperation({ summary: 'Create a named album (OWNER, PARENT, CAREGIVER)' })
  async create(@Param('id', ParseUUIDPipe) childId: string, @Body() dto: CreateAlbumDto) {
    return this.createAlbum.execute({ childId, name: dto.name });
  }

  @Get()
  @ApiOperation({ summary: 'List albums for a child (any active member)' })
  async findAll(@Param('id', ParseUUIDPipe) childId: string) {
    return this.listAlbums.execute({ childId });
  }
}
