import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  milestones: true,
  reminders: true,
  tips: true,
  familyComments: true,
  weeklyDigest: true,
};

export class NotificationSettingsDto {
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  milestones?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  reminders?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  tips?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  familyComments?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  weeklyDigest?: boolean;
}
