import { Inject, Injectable } from '@nestjs/common';
import { FAMILY_REPOSITORY, IFamilyRepository } from '../repositories/family.repository.interface';

@Injectable()
export class ListFamiliesUseCase {
  constructor(@Inject(FAMILY_REPOSITORY) private readonly familyRepo: IFamilyRepository) {}

  async execute(input: { userId: string }) {
    const data = await this.familyRepo.findManyForUser(input.userId);
    return { data, meta: { hasMore: false } };
  }
}
