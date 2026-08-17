import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { NotificationSettingsDto } from '../dtos/notification-settings.dto';
import { GetUserProfileUseCase } from '../usecases/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from '../usecases/update-user-profile.usecase';
import { GetNotificationSettingsUseCase } from '../usecases/get-notification-settings.usecase';
import { UpdateNotificationSettingsUseCase } from '../usecases/update-notification-settings.usecase';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly getUserProfile: GetUserProfileUseCase,
    private readonly updateUserProfile: UpdateUserProfileUseCase,
    private readonly getNotificationSettings: GetNotificationSettingsUseCase,
    private readonly updateNotificationSettings: UpdateNotificationSettingsUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current authenticated user profile' })
  async me(@CurrentUser('id') userId: string) {
    return this.getUserProfile.execute({ userId });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current authenticated user profile' })
  async updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.updateUserProfile.execute({ userId, ...dto });
  }

  @Get('me/notification-settings')
  @ApiOperation({ summary: 'Get the current user notification preferences' })
  async notificationSettings(@CurrentUser('id') userId: string) {
    return this.getNotificationSettings.execute({ userId });
  }

  @Patch('me/notification-settings')
  @ApiOperation({ summary: 'Update the current user notification preferences' })
  async updateNotificationSettingsHandler(
    @CurrentUser('id') userId: string,
    @Body() dto: NotificationSettingsDto,
  ) {
    return this.updateNotificationSettings.execute({ userId, settings: dto });
  }
}
