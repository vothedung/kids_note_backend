import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomInt } from 'crypto';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from './redis-client.provider';

export type OtpPurpose = 'register' | 'reset';

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

function otpKey(purpose: OtpPurpose, email: string): string {
  return `otp:${purpose}:${email.toLowerCase()}`;
}

function cooldownKey(purpose: OtpPurpose, email: string): string {
  return `otp-cooldown:${purpose}:${email.toLowerCase()}`;
}

function attemptsKey(purpose: OtpPurpose, email: string): string {
  return `otp-attempts:${purpose}:${email.toLowerCase()}`;
}

function hash(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/**
 * Redis-backed OTP codes (per the original architecture blueprint's
 * "otp" Redis key) for email verification (register) and password reset.
 * Codes are 6-digit numeric, single-use, 10-minute TTL, with a 60s resend
 * cooldown and a 5-attempt brute-force cap.
 */
@Injectable()
export class OtpService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async canResend(purpose: OtpPurpose, email: string): Promise<boolean> {
    const exists = await this.redis.exists(cooldownKey(purpose, email));
    return exists === 0;
  }

  async generate(purpose: OtpPurpose, email: string): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.redis
      .multi()
      .set(otpKey(purpose, email), hash(code), 'EX', OTP_TTL_SECONDS)
      .set(cooldownKey(purpose, email), '1', 'EX', RESEND_COOLDOWN_SECONDS)
      .del(attemptsKey(purpose, email))
      .exec();
    return code;
  }

  /** Verifies and, on success, invalidates the code (single-use). */
  async verify(purpose: OtpPurpose, email: string, code: string): Promise<boolean> {
    const key = otpKey(purpose, email);
    const stored = await this.redis.get(key);
    if (!stored) return false;

    if (stored !== hash(code)) {
      const attempts = await this.redis.incr(attemptsKey(purpose, email));
      if (attempts >= MAX_ATTEMPTS) {
        await this.redis.del(key);
      }
      return false;
    }

    await this.redis.del(key, attemptsKey(purpose, email));
    return true;
  }
}
