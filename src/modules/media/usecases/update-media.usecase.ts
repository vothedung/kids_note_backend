import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IMediaRepository, MEDIA_REPOSITORY } from '../repositories/media.repository.interface';
import { ALBUM_REPOSITORY, IAlbumRepository } from '../repositories/album.repository.interface';

@Injectable()
export class UpdateMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY) private readonly mediaRepo: IMediaRepository,
    @Inject(ALBUM_REPOSITORY) private readonly albumRepo: IAlbumRepository,
  ) {}

  async execute(input: { id: string; caption?: string; albumId?: string }) {
    const media = await this.mediaRepo.findById(input.id);
    if (!media) throw new NotFoundException('Media not found');

    if (input.albumId) {
      const album = await this.albumRepo.findById(input.albumId);
      if (!album || album.childId !== media.childId) {
        throw new NotFoundException('Album not found for this child');
      }
    }

    return this.mediaRepo.update(input.id, { caption: input.caption, albumId: input.albumId });
  }
}
