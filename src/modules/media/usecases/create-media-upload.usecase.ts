import { Inject, Injectable } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { IMediaRepository, MEDIA_REPOSITORY } from '../repositories/media.repository.interface';
import { StorageService } from '../../shared/services/storage.service';

/**
 * Creates the Media record and returns a signed upload URL for the client to
 * upload the binary directly to Supabase Storage. The record's `url` is the
 * eventual public URL (object key resolved ahead of upload).
 */
@Injectable()
export class CreateMediaUploadUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY) private readonly repo: IMediaRepository,
    private readonly storageService: StorageService,
  ) {}

  async execute(input: {
    childId: string;
    noteId?: string;
    type: MediaType;
    fileName: string;
    contentType: string;
    takenAt: string;
    sizeBytes?: number;
  }) {
    const key = this.storageService.buildObjectKey(input.childId, input.fileName);
    const { signedUrl, token } = await this.storageService.getUploadSignedUrl(key);
    const publicUrl = this.storageService.publicUrlFor(key);

    const media = await this.repo.create({
      childId: input.childId,
      noteId: input.noteId,
      url: publicUrl,
      type: input.type,
      sizeBytes: input.sizeBytes,
      takenAt: new Date(input.takenAt),
    });

    return { media, uploadUrl: signedUrl, uploadToken: token, key };
  }
}
