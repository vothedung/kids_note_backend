import { PasswordResetTokenEntity } from '../entities/password-reset-token.entity';

export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol('PASSWORD_RESET_TOKEN_REPOSITORY');

export interface IPasswordResetTokenRepository {
  create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<PasswordResetTokenEntity>;
  findByTokenHash(tokenHash: string): Promise<PasswordResetTokenEntity | null>;
  markUsed(id: string): Promise<void>;
}
