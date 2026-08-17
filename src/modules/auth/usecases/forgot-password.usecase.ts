import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { OtpService } from '../../shared/services/otp.service';
import { EMAIL_PROVIDER, IEmailProvider } from '../../shared/services/email-provider.interface';

export interface ForgotPasswordInput {
  email: string;
}

/**
 * Always responds with a generic success message regardless of whether the
 * email is registered, to avoid leaking account existence. Local (LOCAL
 * provider) accounts only — social-login accounts have no password to reset.
 * Sends a 6-digit OTP (see OtpService); the client verifies it via
 * POST /auth/verify-otp to obtain a reset token, then calls
 * POST /auth/reset-password with that token.
 */
@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<{ message: string }> {
    const message = 'If an account exists for this email, a verification code has been sent.';

    const user = await this.usersService.findByEmail(input.email);
    if (!user || !user.passwordHash) {
      return { message };
    }

    try {
      const code = await this.otpService.generate('reset', user.email);
      await this.emailProvider.sendOtpEmail({ to: user.email, code, purpose: 'reset' });
    } catch (error) {
      // Never fail the request over email-delivery issues — that would leak
      // account existence and turn a provider outage into a user-facing 500.
      this.logger.error(`Failed to send password reset OTP to ${user.email}`, error as Error);
    }

    return { message };
  }
}
