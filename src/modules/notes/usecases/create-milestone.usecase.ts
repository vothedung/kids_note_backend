import { Inject, Injectable } from '@nestjs/common';
import {
  IMilestoneRepository,
  MILESTONE_REPOSITORY,
} from '../repositories/milestone.repository.interface';

@Injectable()
export class CreateMilestoneUseCase {
  constructor(@Inject(MILESTONE_REPOSITORY) private readonly repo: IMilestoneRepository) {}

  async execute(input: {
    childId: string;
    title: string;
    description?: string;
    milestoneDate: string;
  }) {
    return this.repo.create({
      childId: input.childId,
      title: input.title,
      description: input.description,
      milestoneDate: new Date(input.milestoneDate),
    });
  }
}
