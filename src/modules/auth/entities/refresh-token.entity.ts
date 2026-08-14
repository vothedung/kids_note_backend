export class RefreshTokenEntity {
  id: string;
  userId: string;
  token: string;
  usedAt?: Date | null;
  revokedAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;

  static fromPrisma(record: any): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();
    Object.assign(entity, record);
    return entity;
  }

  isValid(): boolean {
    return !this.usedAt && !this.revokedAt && this.expiresAt > new Date();
  }
}
