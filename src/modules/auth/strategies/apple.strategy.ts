import { Injectable } from '@nestjs/common';

/**
 * Apple Sign-In requires a client-secret JWT signed with the team's private
 * key (ES256) and does not ship a maintained passport strategy compatible
 * with this stack out of the box. Rather than pull in an unverified third
 * -party package, this stub implements the same shape the AI/social usecase
 * expects (`validate(idToken) -> { providerId, email, fullName }`) so the
 * `/auth/social/apple` endpoint can be wired end-to-end today and swapped
 * for a real `apple-signin-auth`-based verifier once APPLE_* secrets exist.
 *
 * TODO: replace with real Apple identity token verification
 * (https://developer.apple.com/documentation/sign_in_with_apple) once
 * APPLE_CLIENT_ID / APPLE_TEAM_ID / APPLE_KEY_ID / APPLE_PRIVATE_KEY are set.
 */
@Injectable()
export class AppleStrategy {
  async validate(
    idToken: string,
  ): Promise<{ providerId: string; email?: string; fullName?: string }> {
    // Decode without verification — placeholder only, NOT production safe.
    const payloadSegment = idToken.split('.')[1];
    if (!payloadSegment) {
      throw new Error('Invalid Apple identity token');
    }
    const payload = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf-8'));
    return {
      providerId: payload.sub,
      email: payload.email,
      fullName: payload.name,
    };
  }
}
