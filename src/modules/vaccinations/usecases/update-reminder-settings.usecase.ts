import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateReminderSettingsUseCase {
  // TODO: persist to a dedicated settings table once one exists.
  async execute(input: { childId: string; enabled?: boolean; daysBefore?: number }) {
    return {
      childId: input.childId,
      enabled: input.enabled ?? true,
      daysBefore: input.daysBefore ?? 7,
    };
  }
}
