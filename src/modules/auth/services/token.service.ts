import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../users/entities/user.entity';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from '../repositories/refresh-token.repository.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** Parses simple duration strings like "15m", "7d" into milliseconds. */
function parseDurationMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 15 * 60 * 1000;
  const amount = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * multipliers[unit];
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async generateTokenPair(user: UserEntity): Promise<TokenPair> {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('auth.jwtSecret'),
        expiresIn: this.configService.get<string>('auth.accessExpiry'),
      },
    );

    const refreshExpiry = this.configService.get<string>('auth.refreshExpiry') ?? '7d';
    const refreshToken = randomUUID() + randomUUID();
    const expiresAt = new Date(Date.now() + parseDurationMs(refreshExpiry));

    await this.refreshTokenRepo.create({ userId: user.id, token: refreshToken, expiresAt });

    return { accessToken, refreshToken };
  }

  /**
   * Refresh-token rotation: validates the old token, detects reuse,
   * revokes-all-on-reuse, marks old token used, issues a new pair.
   */
  async rotateRefreshToken(
    oldToken: string,
    findUser: (id: string) => Promise<UserEntity | null>,
  ): Promise<TokenPair> {
    const stored = await this.refreshTokenRepo.findByToken(oldToken);
    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (stored.usedAt || stored.revokedAt) {
      // Reuse detected — revoke all tokens for this user.
      await this.refreshTokenRepo.revokeAllForUser(stored.userId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }
    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.refreshTokenRepo.markUsed(oldToken);

    const user = await findUser(stored.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.generateTokenPair(user);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenRepo.revokeAllForUser(userId);
  }
}
