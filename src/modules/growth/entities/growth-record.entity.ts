export class GrowthRecordEntity {
  id: string;
  childId: string;
  weightKg?: number | null;
  heightCm?: number | null;
  headCircumCm?: number | null;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): GrowthRecordEntity {
    const entity = new GrowthRecordEntity();
    entity.id = record.id;
    entity.childId = record.childId;
    entity.weightKg =
      record.weightKg !== null && record.weightKg !== undefined ? Number(record.weightKg) : null;
    entity.heightCm =
      record.heightCm !== null && record.heightCm !== undefined ? Number(record.heightCm) : null;
    entity.headCircumCm =
      record.headCircumCm !== null && record.headCircumCm !== undefined
        ? Number(record.headCircumCm)
        : null;
    entity.recordedAt = record.recordedAt;
    entity.createdAt = record.createdAt;
    entity.updatedAt = record.updatedAt;
    entity.deletedAt = record.deletedAt;
    return entity;
  }
}
