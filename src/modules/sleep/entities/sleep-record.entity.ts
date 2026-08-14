export class SleepRecordEntity {
  id: string;
  childId: string;
  startedAt: Date;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): SleepRecordEntity {
    const entity = new SleepRecordEntity();
    Object.assign(entity, record);
    return entity;
  }

  durationMinutes(): number | null {
    if (!this.endedAt) return null;
    return Math.round((this.endedAt.getTime() - this.startedAt.getTime()) / 60000);
  }
}
