import { Injectable } from '@nestjs/common';
import { AuthProvider } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserData, IUserRepository } from './user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    return record ? UserEntity.fromPrisma(record) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });
    return record ? UserEntity.fromPrisma(record) : null;
  }

  async findByProvider(provider: AuthProvider, providerId: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findFirst({
      where: { provider, providerId, deletedAt: null },
    });
    return record ? UserEntity.fromPrisma(record) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const record = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash ?? null,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl ?? null,
        provider: data.provider ?? AuthProvider.LOCAL,
        providerId: data.providerId ?? null,
      },
    });
    return UserEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateUserData>): Promise<UserEntity> {
    const record = await this.prisma.user.update({ where: { id }, data });
    return UserEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
