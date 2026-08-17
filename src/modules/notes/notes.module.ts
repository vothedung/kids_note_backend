import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { NotesController } from './controllers/notes.controller';
import { MilestonesController } from './controllers/milestones.controller';
import { TimelineController } from './controllers/timeline.controller';
import { NOTE_REPOSITORY } from './repositories/note.repository.interface';
import { NotePrismaRepository } from './repositories/note.prisma-repository';
import { MILESTONE_REPOSITORY } from './repositories/milestone.repository.interface';
import { MilestonePrismaRepository } from './repositories/milestone.prisma-repository';
import { CreateNoteUseCase } from './usecases/create-note.usecase';
import { ListNotesUseCase } from './usecases/list-notes.usecase';
import { GetNoteUseCase } from './usecases/get-note.usecase';
import { UpdateNoteUseCase } from './usecases/update-note.usecase';
import { DeleteNoteUseCase } from './usecases/delete-note.usecase';
import { CreateMilestoneUseCase } from './usecases/create-milestone.usecase';
import { ListMilestonesUseCase } from './usecases/list-milestones.usecase';
import { UpdateMilestoneUseCase } from './usecases/update-milestone.usecase';
import { DeleteMilestoneUseCase } from './usecases/delete-milestone.usecase';
import { GetTimelineUseCase } from './usecases/get-timeline.usecase';

@Module({
  imports: [ChildrenModule],
  controllers: [NotesController, MilestonesController, TimelineController],
  providers: [
    { provide: NOTE_REPOSITORY, useClass: NotePrismaRepository },
    { provide: MILESTONE_REPOSITORY, useClass: MilestonePrismaRepository },
    CreateNoteUseCase,
    ListNotesUseCase,
    GetNoteUseCase,
    UpdateNoteUseCase,
    DeleteNoteUseCase,
    CreateMilestoneUseCase,
    ListMilestonesUseCase,
    UpdateMilestoneUseCase,
    DeleteMilestoneUseCase,
    GetTimelineUseCase,
  ],
  exports: [ListNotesUseCase, ListMilestonesUseCase],
})
export class NotesModule {}
