export class NotificationEntity {
  id: string;
  familyId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): NotificationEntity {
    const entity = new NotificationEntity();
    Object.assign(entity, record);
    return entity;
  }
}
