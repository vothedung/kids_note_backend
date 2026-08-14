import { Inject, Injectable } from '@nestjs/common';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../repositories/notification.repository.interface';
import { FamilyMembershipService } from '../../families/services/family-membership.service';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly repo: INotificationRepository,
    private readonly membershipService: FamilyMembershipService,
  ) {}

  async execute(input: {
    familyId: string;
    userId: string;
    cursor?: string;
    limit?: number;
    unreadOnly?: boolean;
  }) {
    await this.membershipService.assertActiveMember(input.familyId, input.userId);
    const { data, cursor, hasMore } = await this.repo.findManyByFamily(input.familyId, {
      cursor: input.cursor,
      limit: input.limit ?? 20,
      unreadOnly: input.unreadOnly,
    });
    return { data, meta: { cursor, hasMore } };
  }
}
