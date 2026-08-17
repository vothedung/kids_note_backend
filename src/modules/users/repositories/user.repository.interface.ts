import { AuthProvider } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
  email: string;
  passwordHash?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  provider?: AuthProvider;
  providerId?: string | null;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByProvider(provider: AuthProvider, providerId: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(id: string, data: Partial<CreateUserData>): Promise<UserEntity>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
  markEmailVerified(id: string): Promise<void>;
  updateNotificationSettings(id: string, settings: Record<string, boolean>): Promise<UserEntity>;
  softDelete(id: string): Promise<void>;
}
