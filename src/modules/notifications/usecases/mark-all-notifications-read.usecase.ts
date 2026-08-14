import { Inject, Injectable } from '@nestjs/common';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../repositories/notification.repository.interface';
import { FamilyMembershipService } from '../../families/services/family-membership.service';

@Injectable()
export class MarkAllNotificationsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repo: INotificationRepository,
    private readonly membershipService: FamilyMembershipService,
  ) {}

  async execute(input: { familyId: string; userId: string }) {
    await this.membershipService.assertActiveMember(input.familyId, input.userId);
    const count = await this.repo.markAllRead(input.familyId);
    return { updated: count };
  }
}
