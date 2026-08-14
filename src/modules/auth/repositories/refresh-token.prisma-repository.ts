import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IRefreshTokenRepository } from './refresh-token.repository.interface';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenPrismaRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshTokenEntity> {
    const record = await this.prisma.refreshToken.create({ data });
    return RefreshTokenEntity.fromPrisma(record);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    const record = await this.prisma.refreshToken.findFirst({
      where: { token, deletedAt: null },
    });
    return record ? RefreshTokenEntity.fromPrisma(record) : null;
  }

  async markUsed(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { usedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
