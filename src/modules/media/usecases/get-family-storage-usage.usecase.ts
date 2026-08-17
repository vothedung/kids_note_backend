import { Inject, Injectable } from '@nestjs/common';
import { IMediaRepository, MEDIA_REPOSITORY } from '../repositories/media.repository.interface';

@Injectable()
export class GetFamilyStorageUsageUseCase {
  constructor(@Inject(MEDIA_REPOSITORY) private readonly repo: IMediaRepository) {}

  async execute(input: { familyId: string }) {
    const { imageBytes, videoBytes } = await this.repo.sumBytesByFamily(input.familyId);
    return { photosBytes: imageBytes, videosBytes: videoBytes };
  }
}
