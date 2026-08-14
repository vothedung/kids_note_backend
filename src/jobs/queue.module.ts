import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { NotificationsModule } from '../modules/notifications/notifications.module';
import { FamiliesModule } from '../modules/families/families.module';
import { AiModule } from '../modules/ai/ai.module';
import { RemindersProcessor } from './processors/reminders.processor';
import { InvitationsCleanupProcessor } from './processors/invitations-cleanup.processor';
import { AiSummaryProcessor } from './processors/ai-summary.processor';

const QUEUE_REMINDERS = 'reminders';
const QUEUE_INVITATIONS_CLEANUP = 'invitations-cleanup';
const QUEUE_AI_SUMMARIES = 'ai-summaries';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get<string>('redis.url'),
      }),
    }),
    BullModule.registerQueue(
      { name: QUEUE_REMINDERS },
      { name: QUEUE_INVITATIONS_CLEANUP },
      { name: QUEUE_AI_SUMMARIES },
    ),
    NotificationsModule,
    FamiliesModule,
    AiModule,
  ],
  providers: [RemindersProcessor, InvitationsCleanupProcessor, AiSummaryProcessor],
})
export class QueueModule implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_REMINDERS) private readonly remindersQueue: Queue,
    @InjectQueue(QUEUE_INVITATIONS_CLEANUP) private readonly invitationsQueue: Queue,
  ) {}

  async onModuleInit() {
    // Repeatable jobs: daily vaccination reminder sweep, daily invitation cleanup.
    await this.remindersQueue.add(
      'send-vaccination-reminders',
      { daysAhead: 7 },
      { repeat: { cron: '0 8 * * *' }, jobId: 'daily-vaccination-reminders' },
    );
    await this.invitationsQueue.add(
      'delete-expired-invitations',
      { olderThanDays: 14 },
      { repeat: { cron: '0 3 * * *' }, jobId: 'daily-invitations-cleanup' },
    );
  }
}
