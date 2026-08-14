import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMilestoneRepository,
  MILESTONE_REPOSITORY,
} from '../repositories/milestone.repository.interface';

@Injectable()
export class UpdateMilestoneUseCase {
  constructor(@Inject(MILESTONE_REPOSITORY) private readonly repo: IMilestoneRepository) {}

  async execute(input: {
    id: string;
    title?: string;
    description?: string;
    milestoneDate?: string;
  }) {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Milestone not found');
    const { id, milestoneDate, ...rest } = input;
    return this.repo.update(id, {
      ...rest,
      ...(milestoneDate ? { milestoneDate: new Date(milestoneDate) } : {}),
    });
  }
}
