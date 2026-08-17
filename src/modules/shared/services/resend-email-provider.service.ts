import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailProvider, OtpEmailRequest } from './email-provider.interface';

const RESEND_API_URL = 'https://api.resend.com/emails';

/** Sends transactional email via the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email). */
@Injectable()
export class ResendEmailProviderService implements IEmailProvider {
  private readonly logger = new Logger(ResendEmailProviderService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendOtpEmail(request: OtpEmailRequest): Promise<void> {
    const apiKey = this.configService.get<string>('email.resendApiKey');
    const from = this.configService.get<string>('email.fromEmail');
    const subject =
      request.purpose === 'register'
        ? 'Verify your Kids Note account'
        : 'Reset your Kids Note password';

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: request.to,
        subject,
        html: this.buildHtml(request),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      this.logger.error(`Resend send failed (${response.status}): ${body}`);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }

  private buildHtml(request: OtpEmailRequest): string {
    const intro =
      request.purpose === 'register'
        ? 'Use this code to verify your Kids Note account:'
        : 'Use this code to reset your Kids Note password:';

    return `
      <p>${intro}</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${request.code}</p>
      <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    `;
  }
}
