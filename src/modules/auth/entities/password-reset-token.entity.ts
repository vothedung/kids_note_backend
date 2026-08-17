export class PasswordResetTokenEntity {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;

  static fromPrisma(record: any): PasswordResetTokenEntity {
    const entity = new PasswordResetTokenEntity();
    Object.assign(entity, record);
    return entity;
  }

  isValid(): boolean {
    return !this.usedAt && this.expiresAt > new Date();
  }
}
