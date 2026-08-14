import { VaccineStatus } from '@prisma/client';

export class VaccinationEntity {
  id: string;
  childId: string;
  vaccineName: string;
  injectionDate?: Date | null;
  status: VaccineStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): VaccinationEntity {
    const entity = new VaccinationEntity();
    Object.assign(entity, record);
    return entity;
  }
}
