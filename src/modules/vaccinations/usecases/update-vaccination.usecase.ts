import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VaccineStatus } from '@prisma/client';
import {
  IVaccinationRepository,
  VACCINATION_REPOSITORY,
} from '../repositories/vaccination.repository.interface';

@Injectable()
export class UpdateVaccinationUseCase {
  constructor(@Inject(VACCINATION_REPOSITORY) private readonly repo: IVaccinationRepository) {}

  async execute(input: {
    id: string;
    vaccineName?: string;
    injectionDate?: string;
    status?: VaccineStatus;
  }) {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Vaccination not found');
    const { id, injectionDate, ...rest } = input;
    return this.repo.update(id, {
      ...rest,
      ...(injectionDate ? { injectionDate: new Date(injectionDate) } : {}),
    });
  }
}
