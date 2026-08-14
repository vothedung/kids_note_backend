export class MilestoneEntity {
  id: string;
  childId: string;
  title: string;
  description?: string | null;
  milestoneDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): MilestoneEntity {
    const entity = new MilestoneEntity();
    Object.assign(entity, record);
    return entity;
  }
}
