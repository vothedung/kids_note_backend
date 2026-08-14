import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';
import { AuthController } from './controllers/auth.controller';
import { REFRESH_TOKEN_REPOSITORY } from './repositories/refresh-token.repository.interface';
import { RefreshTokenPrismaRepository } from './repositories/refresh-token.prisma-repository';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { RegisterUseCase } from './usecases/register.usecase';
import { LoginUseCase } from './usecases/login.usecase';
import { RefreshTokensUseCase } from './usecases/refresh-tokens.usecase';
import { LogoutUseCase } from './usecases/logout.usecase';
import { SocialLoginUseCase } from './usecases/social-login.usecase';

@Module({
  imports: [
    UsersModule,
    SharedModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('auth.accessExpiry') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenPrismaRepository },
    TokenService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AppleStrategy,
    RegisterUseCase,
    LoginUseCase,
    RefreshTokensUseCase,
    LogoutUseCase,
    SocialLoginUseCase,
  ],
  exports: [TokenService],
})
export class AuthModule {}
