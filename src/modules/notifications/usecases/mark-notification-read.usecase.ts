import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../repositories/notification.repository.interface';
import { FamilyMembershipService } from '../../families/services/family-membership.service';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repo: INotificationRepository,
    private readonly membershipService: FamilyMembershipService,
  ) {}

  async execute(input: { id: string; userId: string }) {
    const notification = await this.repo.findById(input.id);
    if (!notification) throw new NotFoundException('Notification not found');
    await this.membershipService.assertActiveMember(notification.familyId, input.userId);
    return this.repo.markRead(input.id);
  }
}
