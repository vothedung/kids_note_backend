import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IMediaRepository, MEDIA_REPOSITORY } from '../repositories/media.repository.interface';

@Injectable()
export class DeleteMediaUseCase {
  constructor(@Inject(MEDIA_REPOSITORY) private readonly repo: IMediaRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Media not found');
    await this.repo.softDelete(input.id);
  }
}
