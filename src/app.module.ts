import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { SharedModule } from './modules/shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FamiliesModule } from './modules/families/families.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ChildrenModule } from './modules/children/children.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotesModule } from './modules/notes/notes.module';
import { MediaModule } from './modules/media/media.module';
import { StorageModule } from './modules/storage/storage.module';
import { GrowthModule } from './modules/growth/growth.module';
import { SleepModule } from './modules/sleep/sleep.module';
import { FeedingModule } from './modules/feeding/feeding.module';
import { VaccinationsModule } from './modules/vaccinations/vaccinations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiModule } from './modules/ai/ai.module';
import { QueueModule } from './jobs/queue.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: (configService.get<number>('app.throttle.ttl') ?? 60) * 1000,
            limit: configService.get<number>('app.throttle.limit') ?? 100,
          },
        ],
      }),
    }),
    PrismaModule,
    HealthModule,
    SharedModule,
    AuthModule,
    UsersModule,
    FamiliesModule,
    SubscriptionsModule,
    ChildrenModule,
    DashboardModule,
    NotesModule,
    MediaModule,
    StorageModule,
    GrowthModule,
    SleepModule,
    FeedingModule,
    VaccinationsModule,
    NotificationsModule,
    AiModule,
    QueueModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
