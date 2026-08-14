import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMilestoneRepository,
  MILESTONE_REPOSITORY,
} from '../repositories/milestone.repository.interface';

@Injectable()
export class DeleteMilestoneUseCase {
  constructor(@Inject(MILESTONE_REPOSITORY) private readonly repo: IMilestoneRepository) {}

  async execute(input: { id: string }): Promise<void> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new NotFoundException('Milestone not found');
    await this.repo.softDelete(input.id);
  }
}
