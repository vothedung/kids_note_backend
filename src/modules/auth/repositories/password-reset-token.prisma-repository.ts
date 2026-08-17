import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPasswordResetTokenRepository } from './password-reset-token.repository.interface';
import { PasswordResetTokenEntity } from '../entities/password-reset-token.entity';

@Injectable()
export class PasswordResetTokenPrismaRepository implements IPasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetTokenEntity> {
    const record = await this.prisma.passwordResetToken.create({ data });
    return PasswordResetTokenEntity.fromPrisma(record);
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetTokenEntity | null> {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    return record ? PasswordResetTokenEntity.fromPrisma(record) : null;
  }

  async markUsed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  }
}
