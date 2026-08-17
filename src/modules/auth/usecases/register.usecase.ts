import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { TokenService } from '../services/token.service';
import { AuditService } from '../../../modules/shared/services/audit.service';
import { OtpService } from '../../shared/services/otp.service';
import { EMAIL_PROVIDER, IEmailProvider } from '../../shared/services/email-provider.interface';

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly auditService: AuditService,
    private readonly otpService: OtpService,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider,
  ) {}

  async execute(input: RegisterInput) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.usersService.createUser({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
    });

    const tokens = await this.tokenService.generateTokenPair(user);
    await this.auditService.log({
      userId: user.id,
      action: 'REGISTER',
      entityType: 'User',
      entityId: user.id,
    });

    try {
      const code = await this.otpService.generate('register', user.email);
      await this.emailProvider.sendOtpEmail({ to: user.email, code, purpose: 'register' });
    } catch (error) {
      // Don't fail registration over a verification-email hiccup — the
      // client can trigger POST /auth/resend-otp to retry.
      this.logger.error(`Failed to send verification OTP to ${user.email}`, error as Error);
    }

    return { user: user.toPublic(), ...tokens };
  }
}
