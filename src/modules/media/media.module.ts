import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { SharedModule } from '../shared/shared.module';
import { MediaController } from './controllers/media.controller';
import { AlbumsController } from './controllers/albums.controller';
import { MEDIA_REPOSITORY } from './repositories/media.repository.interface';
import { MediaPrismaRepository } from './repositories/media.prisma-repository';
import { ALBUM_REPOSITORY } from './repositories/album.repository.interface';
import { AlbumPrismaRepository } from './repositories/album.prisma-repository';
import { CreateMediaUploadUseCase } from './usecases/create-media-upload.usecase';
import { ListMediaUseCase } from './usecases/list-media.usecase';
import { UpdateMediaUseCase } from './usecases/update-media.usecase';
import { DeleteMediaUseCase } from './usecases/delete-media.usecase';
import { GetFamilyStorageUsageUseCase } from './usecases/get-family-storage-usage.usecase';
import { CreateAlbumUseCase } from './usecases/create-album.usecase';
import { ListAlbumsUseCase } from './usecases/list-albums.usecase';

@Module({
  imports: [ChildrenModule, SharedModule],
  controllers: [MediaController, AlbumsController],
  providers: [
    { provide: MEDIA_REPOSITORY, useClass: MediaPrismaRepository },
    { provide: ALBUM_REPOSITORY, useClass: AlbumPrismaRepository },
    CreateMediaUploadUseCase,
    ListMediaUseCase,
    UpdateMediaUseCase,
    DeleteMediaUseCase,
    GetFamilyStorageUsageUseCase,
    CreateAlbumUseCase,
    ListAlbumsUseCase,
  ],
  exports: [GetFamilyStorageUsageUseCase],
})
export class MediaModule {}
