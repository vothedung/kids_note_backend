import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { QueryNotificationsDto } from '../dtos/query-notifications.dto';
import { MarkAllReadDto } from '../dtos/mark-all-read.dto';
import { ListNotificationsUseCase } from '../usecases/list-notifications.usecase';
import { MarkNotificationReadUseCase } from '../usecases/mark-notification-read.usecase';
import { MarkAllNotificationsReadUseCase } from '../usecases/mark-all-notifications-read.usecase';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(
    private readonly listNotifications: ListNotificationsUseCase,
    private readonly markNotificationRead: MarkNotificationReadUseCase,
    private readonly markAllNotificationsRead: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for a family (any active member)' })
  async findAll(@CurrentUser('id') userId: string, @Query() query: QueryNotificationsDto) {
    return this.listNotifications.execute({
      familyId: query.familyId,
      userId,
      cursor: query.cursor,
      limit: query.limit,
      unreadOnly: query.unreadOnly,
    });
  }

  @Patch()
  @ApiOperation({ summary: 'Mark all notifications read for a family' })
  async markAllRead(@CurrentUser('id') userId: string, @Body() dto: MarkAllReadDto) {
    return this.markAllNotificationsRead.execute({ familyId: dto.familyId, userId });
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single notification read' })
  async markRead(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.markNotificationRead.execute({ id, userId });
  }
}
