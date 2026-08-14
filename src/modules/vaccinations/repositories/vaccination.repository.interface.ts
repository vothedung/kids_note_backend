import { VaccineStatus } from '@prisma/client';
import { VaccinationEntity } from '../entities/vaccination.entity';

export const VACCINATION_REPOSITORY = Symbol('VACCINATION_REPOSITORY');

export interface CreateVaccinationData {
  childId: string;
  vaccineName: string;
  injectionDate?: Date | null;
  status?: VaccineStatus;
}

export interface IVaccinationRepository {
  findById(id: string): Promise<VaccinationEntity | null>;
  findManyByChild(
    childId: string,
    params: { cursor?: string; limit: number },
  ): Promise<{ data: VaccinationEntity[]; cursor: string | null; hasMore: boolean }>;
  create(data: CreateVaccinationData): Promise<VaccinationEntity>;
  update(id: string, data: Partial<CreateVaccinationData>): Promise<VaccinationEntity>;
  softDelete(id: string): Promise<void>;
}
