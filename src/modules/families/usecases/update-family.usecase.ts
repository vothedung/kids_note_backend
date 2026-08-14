import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FAMILY_REPOSITORY, IFamilyRepository } from '../repositories/family.repository.interface';

@Injectable()
export class UpdateFamilyUseCase {
  constructor(@Inject(FAMILY_REPOSITORY) private readonly familyRepo: IFamilyRepository) {}

  async execute(input: { id: string; name?: string }) {
    const existing = await this.familyRepo.findById(input.id);
    if (!existing) throw new NotFoundException('Family not found');
    return this.familyRepo.update(input.id, { name: input.name });
  }
}
