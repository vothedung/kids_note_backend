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
import { CreateMediaDto } from '../dtos/create-media.dto';
import { QueryMediaDto } from '../dtos/query-media.dto';
import { UpdateMediaDto } from '../dtos/update-media.dto';
import { CreateMediaUploadUseCase } from '../usecases/create-media-upload.usecase';
import { ListMediaUseCase } from '../usecases/list-media.usecase';
import { UpdateMediaUseCase } from '../usecases/update-media.usecase';
import { DeleteMediaUseCase } from '../usecases/delete-media.usecase';

const CREATE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];
const DELETE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT];

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:id/media', version: '1' })
export class MediaController {
  constructor(
    private readonly createMediaUpload: CreateMediaUploadUseCase,
    private readonly listMedia: ListMediaUseCase,
    private readonly updateMedia: UpdateMediaUseCase,
    private readonly deleteMedia: DeleteMediaUseCase,
  ) {}

  @Post()
  @Roles(...CREATE_ROLES)
  @ApiOperation({
    summary:
      'Request a presigned upload URL and create the Media record (OWNER, PARENT, CAREGIVER)',
  })
  async create(@Param('id', ParseUUIDPipe) childId: string, @Body() dto: CreateMediaDto) {
    return this.createMediaUpload.execute({ childId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List media, optionally grouped by year/month' })
  async findAll(@Param('id', ParseUUIDPipe) childId: string, @Query() query: QueryMediaDto) {
    return this.listMedia.execute({ childId, groupBy: query.groupBy });
  }

  @Patch(':mediaId')
  @Roles(...CREATE_ROLES)
  @ApiOperation({ summary: 'Update a media item caption/album (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('mediaId', ParseUUIDPipe) mediaId: string, @Body() dto: UpdateMediaDto) {
    return this.updateMedia.execute({ id: mediaId, ...dto });
  }

  @Delete(':mediaId')
  @Roles(...DELETE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a media item (OWNER, PARENT)' })
  async remove(@Param('mediaId', ParseUUIDPipe) mediaId: string) {
    await this.deleteMedia.execute({ id: mediaId });
    return { deleted: true };
  }
}
