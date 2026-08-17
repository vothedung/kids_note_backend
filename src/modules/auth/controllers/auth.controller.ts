import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthProvider } from '@prisma/client';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { ResendOtpDto } from '../dtos/resend-otp.dto';
import { RegisterUseCase } from '../usecases/register.usecase';
import { LoginUseCase } from '../usecases/login.usecase';
import { RefreshTokensUseCase } from '../usecases/refresh-tokens.usecase';
import { LogoutUseCase } from '../usecases/logout.usecase';
import { SocialLoginUseCase } from '../usecases/social-login.usecase';
import { ForgotPasswordUseCase } from '../usecases/forgot-password.usecase';
import { ResetPasswordUseCase } from '../usecases/reset-password.usecase';
import { VerifyOtpUseCase } from '../usecases/verify-otp.usecase';
import { ResendOtpUseCase } from '../usecases/resend-otp.usecase';
import { AppleStrategy } from '../strategies/apple.strategy';

const SUPPORTED_PROVIDERS = ['google', 'facebook', 'apple'] as const;

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly resendOtpUseCase: ResendOtpUseCase,
    private readonly appleStrategy: AppleStrategy,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new local account' })
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login with email/password' })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate refresh token, issue new access/refresh pair' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokensUseCase.execute(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request a password reset OTP email (always returns a generic message)',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({
    summary:
      'Verify a 6-digit OTP for email verification (purpose=register) or password reset (purpose=reset, returns a resetToken)',
  })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.verifyOtpUseCase.execute(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend an OTP code (60s cooldown; always returns a generic message)' })
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.resendOtpUseCase.execute(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using the resetToken from POST /auth/verify-otp' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Revoke all refresh tokens for the current user' })
  async logout(@CurrentUser('id') userId: string) {
    await this.logoutUseCase.execute({ userId });
    return { loggedOut: true };
  }

  // --- Social login (Google / Facebook / Apple) ---
  // Passport strategies are wired for google/facebook (redirect flow).
  // Apple uses a direct id_token exchange (POST body) since it has no
  // redirect-based passport strategy in this stack — see AppleStrategy.

  @Public()
  @Get('social/:provider')
  @ApiParam({ name: 'provider', enum: SUPPORTED_PROVIDERS })
  @ApiOperation({ summary: 'Kick off OAuth redirect for google/facebook' })
  async socialRedirect(@Param('provider') provider: string) {
    if (provider === 'google' || provider === 'facebook') {
      // Actual redirect is handled by the AuthGuard(provider) below on the
      // dedicated route; this handler exists for API-surface completeness
      // and returns guidance for clients hitting it directly without a guard.
      return { redirectTo: `/api/v1/auth/social/${provider}/start` };
    }
    throw new BadRequestException(
      `Provider ${provider} uses POST /auth/social/apple with an id_token body`,
    );
  }

  @Public()
  @Get('social/google/start')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Redirect to Google consent screen' })
  googleStart() {
    // Guard handles the redirect.
  }

  @Public()
  @Get('social/google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: Request) {
    const profile = req.user as any;
    return this.socialLoginUseCase.execute({
      provider: AuthProvider.GOOGLE,
      providerId: profile.providerId,
      email: profile.email,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
    });
  }

  @Public()
  @Get('social/facebook/start')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Redirect to Facebook consent screen' })
  facebookStart() {
    // Guard handles the redirect.
  }

  @Public()
  @Get('social/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  async facebookCallback(@Req() req: Request) {
    const profile = req.user as any;
    return this.socialLoginUseCase.execute({
      provider: AuthProvider.FACEBOOK,
      providerId: profile.providerId,
      email: profile.email,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
    });
  }

  @Public()
  @Post('social/apple')
  @ApiOperation({ summary: 'Exchange an Apple identity token for a session' })
  async appleLogin(@Body('idToken') idToken: string) {
    if (!idToken) throw new BadRequestException('idToken is required');
    const profile = await this.appleStrategy.validate(idToken);
    return this.socialLoginUseCase.execute({
      provider: AuthProvider.APPLE,
      providerId: profile.providerId,
      email: profile.email,
      fullName: profile.fullName,
    });
  }
}
