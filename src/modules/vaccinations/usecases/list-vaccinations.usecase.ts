import { Inject, Injectable } from '@nestjs/common';
import {
  IVaccinationRepository,
  VACCINATION_REPOSITORY,
} from '../repositories/vaccination.repository.interface';

@Injectable()
export class ListVaccinationsUseCase {
  constructor(@Inject(VACCINATION_REPOSITORY) private readonly repo: IVaccinationRepository) {}

  async execute(input: { childId: string; cursor?: string; limit?: number }) {
    const { data, cursor, hasMore } = await this.repo.findManyByChild(input.childId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
