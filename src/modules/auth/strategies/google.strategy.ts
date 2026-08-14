import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

/**
 * Google OAuth2 strategy. Requires GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL to be
 * configured; wired here so the endpoint exists even before real secrets are
 * available (Passport will throw at request time if misconfigured).
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.google.clientId') || 'stub-client-id',
      clientSecret: configService.get<string>('auth.google.clientSecret') || 'stub-secret',
      callbackURL:
        configService.get<string>('auth.google.callbackUrl') ||
        'http://localhost:3000/api/v1/auth/social/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): void {
    const { emails, displayName, photos, id } = profile;
    done(null, {
      providerId: id,
      email: emails?.[0]?.value,
      fullName: displayName,
      avatarUrl: photos?.[0]?.value,
    });
  }
}
