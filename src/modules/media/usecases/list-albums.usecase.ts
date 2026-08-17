import { Inject, Injectable } from '@nestjs/common';
import { ALBUM_REPOSITORY, IAlbumRepository } from '../repositories/album.repository.interface';

@Injectable()
export class ListAlbumsUseCase {
  constructor(@Inject(ALBUM_REPOSITORY) private readonly repo: IAlbumRepository) {}

  async execute(input: { childId: string }) {
    return { data: await this.repo.findAllByChild(input.childId) };
  }
}
