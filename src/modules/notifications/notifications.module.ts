import { Module } from '@nestjs/common';
import { FamiliesModule } from '../families/families.module';
import { NotificationsController } from './controllers/notifications.controller';
import { NOTIFICATION_REPOSITORY } from './repositories/notification.repository.interface';
import { NotificationPrismaRepository } from './repositories/notification.prisma-repository';
import { NotificationsService } from './services/notifications.service';
import { ListNotificationsUseCase } from './usecases/list-notifications.usecase';
import { MarkNotificationReadUseCase } from './usecases/mark-notification-read.usecase';
import { MarkAllNotificationsReadUseCase } from './usecases/mark-all-notifications-read.usecase';

@Module({
  imports: [FamiliesModule],
  controllers: [NotificationsController],
  providers: [
    { provide: NOTIFICATION_REPOSITORY, useClass: NotificationPrismaRepository },
    NotificationsService,
    ListNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
