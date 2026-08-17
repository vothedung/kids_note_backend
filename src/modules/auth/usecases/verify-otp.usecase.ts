import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UsersService } from '../../users/services/users.service';
import { OtpService, OtpPurpose } from '../../shared/services/otp.service';
import {
  IPasswordResetTokenRepository,
  PASSWORD_RESET_TOKEN_REPOSITORY,
} from '../repositories/password-reset-token.repository.interface';

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

export interface VerifyOtpInput {
  email: string;
  code: string;
  purpose: OtpPurpose;
}

/**
 * Verifies an OTP sent for either email verification (register) or password
 * reset. On success:
 *  - purpose "register": marks the user's email verified.
 *  - purpose "reset": issues a short-lived reset token for the client to
 *    submit to POST /auth/reset-password (keeps that endpoint's contract
 *    unchanged — OTP is just a new front door to obtaining a reset token).
 */
@Injectable()
export class VerifyOtpUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly resetTokenRepo: IPasswordResetTokenRepository,
  ) {}

  async execute(input: VerifyOtpInput): Promise<{ verified: true; resetToken?: string }> {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) throw new NotFoundException('Account not found');

    const valid = await this.otpService.verify(input.purpose, input.email, input.code);
    if (!valid) throw new BadRequestException('Invalid or expired code');

    if (input.purpose === 'register') {
      await this.usersService.markEmailVerified(user.id);
      return { verified: true };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await this.resetTokenRepo.create({ userId: user.id, tokenHash, expiresAt });

    return { verified: true, resetToken: rawToken };
  }
}
