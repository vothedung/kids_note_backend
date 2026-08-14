import { Inject, Injectable } from '@nestjs/common';
import { VaccineStatus } from '@prisma/client';
import {
  IVaccinationRepository,
  VACCINATION_REPOSITORY,
} from '../repositories/vaccination.repository.interface';

@Injectable()
export class CreateVaccinationUseCase {
  constructor(@Inject(VACCINATION_REPOSITORY) private readonly repo: IVaccinationRepository) {}

  async execute(input: {
    childId: string;
    vaccineName: string;
    injectionDate?: string;
    status?: VaccineStatus;
  }) {
    return this.repo.create({
      childId: input.childId,
      vaccineName: input.vaccineName,
      injectionDate: input.injectionDate ? new Date(input.injectionDate) : null,
      status: input.status ?? VaccineStatus.UPCOMING,
    });
  }
}
