import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IVaccinationRepository,
  VACCINATION_REPOSITORY,
} from '../repositories/vaccination.repository.interface';

@Injectable()
export class DeleteVaccinationUseCase {
  constructor(@Inject(VACCINATION_REPOSITORY) private readonly repo: IVaccinationRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Vaccination not found');
    await this.repo.softDelete(input.id);
  }
}
