import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../dtos/notification-settings.dto';

@Injectable()
export class GetNotificationSettingsUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(input: { userId: string }) {
    const user = await this.usersService.getOrThrow(input.userId);
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...(user.notificationSettings ?? {}) };
  }
}
