import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import {
  CreateUserData,
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

/**
 * Public API of the `users` module. Other modules (auth, families, ...) must
 * depend on this service, never on the User repository directly.
 */
@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository) {}

  findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findById(id);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findByEmail(email);
  }

  findByProvider(provider: AuthProvider, providerId: string): Promise<UserEntity | null> {
    return this.userRepo.findByProvider(provider, providerId);
  }

  createUser(data: CreateUserData): Promise<UserEntity> {
    return this.userRepo.create(data);
  }

  async updateProfile(
    id: string,
    data: Partial<Pick<CreateUserData, 'fullName' | 'avatarUrl'>>,
  ): Promise<UserEntity> {
    const existing = await this.userRepo.findById(id);
    if (!existing) throw new NotFoundException('User not found');
    return this.userRepo.update(id, data);
  }

  async getOrThrow(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    return this.userRepo.updatePasswordHash(id, passwordHash);
  }

  markEmailVerified(id: string): Promise<void> {
    return this.userRepo.markEmailVerified(id);
  }

  async updateNotificationSettings(
    id: string,
    settings: Record<string, boolean>,
  ): Promise<UserEntity> {
    return this.userRepo.updateNotificationSettings(id, settings);
  }
}
