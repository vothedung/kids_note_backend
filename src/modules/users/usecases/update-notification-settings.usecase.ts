import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationSettingsDto,
} from '../dtos/notification-settings.dto';

@Injectable()
export class UpdateNotificationSettingsUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(input: { userId: string; settings: NotificationSettingsDto }) {
    const user = await this.usersService.getOrThrow(input.userId);
    const merged = {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(user.notificationSettings ?? {}),
      ...input.settings,
    };
    const updated = await this.usersService.updateNotificationSettings(input.userId, merged);
    return updated.notificationSettings;
  }
}
