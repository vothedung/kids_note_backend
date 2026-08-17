import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  resendApiKey: process.env.RESEND_API_KEY,
  fromEmail: process.env.RESEND_FROM_EMAIL ?? 'Kids Note <onboarding@resend.dev>',
}));
