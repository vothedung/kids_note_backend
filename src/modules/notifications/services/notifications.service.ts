import { Inject, Injectable } from '@nestjs/common';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../repositories/notification.repository.interface';

/** Public API of the `notifications` module for other modules/jobs to create notifications. */
@Injectable()
export class NotificationsService {
  constructor(@Inject(NOTIFICATION_REPOSITORY) private readonly repo: INotificationRepository) {}

  create(data: { familyId: string; title: string; body: string }) {
    return this.repo.create(data);
  }
}
