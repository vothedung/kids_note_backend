import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Per-child vaccination reminder preferences. There is no dedicated table for
 * this yet (see prisma/schema.prisma); the usecase currently echoes the
 * validated settings back. TODO: persist once a `VaccinationReminderSettings`
 * model (or a JSON column on Child) is introduced.
 */
export class ReminderSettingsDto {
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;

  @ApiPropertyOptional({ default: 7, description: 'Days before the due date to notify' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(60)
  daysBefore?: number = 7;
}
