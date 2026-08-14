import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { SharedModule } from '../shared/shared.module';
import { MediaController } from './controllers/media.controller';
import { MEDIA_REPOSITORY } from './repositories/media.repository.interface';
import { MediaPrismaRepository } from './repositories/media.prisma-repository';
import { CreateMediaUploadUseCase } from './usecases/create-media-upload.usecase';
import { ListMediaUseCase } from './usecases/list-media.usecase';
import { DeleteMediaUseCase } from './usecases/delete-media.usecase';

@Module({
  imports: [ChildrenModule, SharedModule],
  controllers: [MediaController],
  providers: [
    { provide: MEDIA_REPOSITORY, useClass: MediaPrismaRepository },
    CreateMediaUploadUseCase,
    ListMediaUseCase,
    DeleteMediaUseCase,
  ],
})
export class MediaModule {}
