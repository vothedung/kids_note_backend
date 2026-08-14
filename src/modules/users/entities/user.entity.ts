import { AuthProvider } from '@prisma/client';

/** Domain entity — framework-free. */
export class UserEntity {
  id: string;
  email: string;
  passwordHash?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  provider: AuthProvider;
  providerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  /** Never expose this outward; use toPublic(). */
  static fromPrisma(record: any): UserEntity {
    const entity = new UserEntity();
    entity.id = record.id;
    entity.email = record.email;
    entity.passwordHash = record.passwordHash;
    entity.fullName = record.fullName;
    entity.avatarUrl = record.avatarUrl;
    entity.provider = record.provider;
    entity.providerId = record.providerId;
    entity.createdAt = record.createdAt;
    entity.updatedAt = record.updatedAt;
    entity.deletedAt = record.deletedAt;
    return entity;
  }

  toPublic() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
      avatarUrl: this.avatarUrl,
      provider: this.provider,
      createdAt: this.createdAt,
    };
  }
}
