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
import { ChildAccessGuard } from '../../children/guards/child-access.guard';
import { CursorPaginationDto } from '../../../common/dtos/pagination.dto';
import { CreateNoteDto } from '../dtos/create-note.dto';
import { UpdateNoteDto } from '../dtos/update-note.dto';
import { CreateNoteUseCase } from '../usecases/create-note.usecase';
import { ListNotesUseCase } from '../usecases/list-notes.usecase';
import { GetNoteUseCase } from '../usecases/get-note.usecase';
import { UpdateNoteUseCase } from '../usecases/update-note.usecase';
import { DeleteNoteUseCase } from '../usecases/delete-note.usecase';

const WRITE_ROLES = [FamilyRole.OWNER, FamilyRole.PARENT, FamilyRole.CAREGIVER];

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ChildAccessGuard, RolesGuard)
@Controller({ path: 'children/:childId/notes', version: '1' })
export class NotesController {
  constructor(
    private readonly createNote: CreateNoteUseCase,
    private readonly listNotes: ListNotesUseCase,
    private readonly getNote: GetNoteUseCase,
    private readonly updateNote: UpdateNoteUseCase,
    private readonly deleteNote: DeleteNoteUseCase,
  ) {}

  @Post()
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Create a note (OWNER, PARENT, CAREGIVER)' })
  async create(
    @Param('childId', ParseUUIDPipe) childId: string,
    @CurrentUser('id') authorId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.createNote.execute({ childId, authorId, ...dto });
  }

  @Get()
  @ApiOperation({ summary: 'List notes (cursor pagination, any active family member)' })
  async findAll(
    @Param('childId', ParseUUIDPipe) childId: string,
    @Query() query: CursorPaginationDto,
  ) {
    return this.listNotes.execute({ childId, cursor: query.cursor, limit: query.limit });
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Get a note by ID' })
  async findOne(@Param('noteId', ParseUUIDPipe) noteId: string) {
    return this.getNote.execute({ id: noteId });
  }

  @Patch(':noteId')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Update a note (OWNER, PARENT, CAREGIVER)' })
  async update(@Param('noteId', ParseUUIDPipe) noteId: string, @Body() dto: UpdateNoteDto) {
    return this.updateNote.execute({ id: noteId, ...dto });
  }

  @Delete(':noteId')
  @Roles(...WRITE_ROLES)
  @ApiOperation({ summary: 'Soft-delete a note (OWNER, PARENT, CAREGIVER)' })
  async remove(@Param('noteId', ParseUUIDPipe) noteId: string) {
    await this.deleteNote.execute({ id: noteId });
    return { deleted: true };
  }
}
