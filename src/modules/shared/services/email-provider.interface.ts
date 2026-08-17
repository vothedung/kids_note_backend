export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');

export interface OtpEmailRequest {
  to: string;
  code: string;
  purpose: 'register' | 'reset';
}

/** Swappable email provider port — implement against a real ESP later. */
export interface IEmailProvider {
  sendOtpEmail(request: OtpEmailRequest): Promise<void>;
}
