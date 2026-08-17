import { Inject, Injectable } from '@nestjs/common';
import { ALBUM_REPOSITORY, IAlbumRepository } from '../repositories/album.repository.interface';

@Injectable()
export class CreateAlbumUseCase {
  constructor(@Inject(ALBUM_REPOSITORY) private readonly repo: IAlbumRepository) {}

  async execute(input: { childId: string; name: string }) {
    return this.repo.create(input);
  }
}
