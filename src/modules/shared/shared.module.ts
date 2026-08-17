import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuditService } from './services/audit.service';
import { StorageService } from './services/storage.service';
import { EMAIL_PROVIDER } from './services/email-provider.interface';
import { StubEmailProviderService } from './services/stub-email-provider.service';
import { ResendEmailProviderService } from './services/resend-email-provider.service';
import { RedisClientProvider } from './services/redis-client.provider';
import { OtpService } from './services/otp.service';

/**
 * Infrastructure-only concerns shared across modules (audit trail, object
 * storage, email, OTP). Never put business logic here — see references/02-architecture.md.
 */
@Module({
  providers: [
    AuditService,
    StorageService,
    StubEmailProviderService,
    ResendEmailProviderService,
    RedisClientProvider,
    OtpService,
    {
      provide: EMAIL_PROVIDER,
      useFactory: (
        configService: ConfigService,
        resend: ResendEmailProviderService,
        stub: StubEmailProviderService,
      ) => (configService.get<string>('email.resendApiKey') ? resend : stub),
      inject: [ConfigService, ResendEmailProviderService, StubEmailProviderService],
    },
  ],
  exports: [AuditService, StorageService, EMAIL_PROVIDER, OtpService],
})
export class SharedModule {}
