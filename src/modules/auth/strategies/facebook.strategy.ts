import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-facebook';

type VerifyCallback = (error: any, user?: any, info?: any) => void;

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.facebook.appId') || 'stub-app-id',
      clientSecret: configService.get<string>('auth.facebook.appSecret') || 'stub-secret',
      callbackURL:
        configService.get<string>('auth.facebook.callbackUrl') ||
        'http://localhost:3000/api/v1/auth/social/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'photos'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): void {
    const { emails, name, photos, id } = profile;
    done(null, {
      providerId: id,
      email: emails?.[0]?.value,
      fullName: name ? `${name.givenName ?? ''} ${name.familyName ?? ''}`.trim() : undefined,
      avatarUrl: photos?.[0]?.value,
    });
  }
}
