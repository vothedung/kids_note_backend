import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider, OtpEmailRequest } from './email-provider.interface';

/**
 * Mocked email provider — no ESP (SendGrid/SES/Resend/etc.) is wired up yet.
 * Logs the OTP code instead of sending a real email so the flow is fully
 * exercisable end-to-end. Swap for a real provider by implementing
 * IEmailProvider and rebinding EMAIL_PROVIDER in SharedModule.
 */
@Injectable()
export class StubEmailProviderService implements IEmailProvider {
  private readonly logger = new Logger(StubEmailProviderService.name);

  async sendOtpEmail(request: OtpEmailRequest): Promise<void> {
    this.logger.log(`[stub email] OTP for ${request.to} (${request.purpose}): ${request.code}`);
  }
}
