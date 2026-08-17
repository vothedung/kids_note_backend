import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { OtpService, OtpPurpose } from '../../shared/services/otp.service';
import { EMAIL_PROVIDER, IEmailProvider } from '../../shared/services/email-provider.interface';

export interface ResendOtpInput {
  email: string;
  purpose: OtpPurpose;
}

@Injectable()
export class ResendOtpUseCase {
  private readonly logger = new Logger(ResendOtpUseCase.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider,
  ) {}

  async execute(input: ResendOtpInput): Promise<{ message: string }> {
    const message = 'If an account exists for this email, a new code has been sent.';

    const user = await this.usersService.findByEmail(input.email);
    if (!user) return { message };

    const canResend = await this.otpService.canResend(input.purpose, input.email);
    if (!canResend) {
      throw new HttpException(
        'Please wait before requesting another code',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    try {
      const code = await this.otpService.generate(input.purpose, user.email);
      await this.emailProvider.sendOtpEmail({ to: user.email, code, purpose: input.purpose });
    } catch (error) {
      this.logger.error(`Failed to resend OTP to ${user.email}`, error as Error);
    }

    return { message };
  }
}
