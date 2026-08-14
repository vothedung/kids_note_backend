import { MilestoneEntity } from '../entities/milestone.entity';

export const MILESTONE_REPOSITORY = Symbol('MILESTONE_REPOSITORY');

export interface CreateMilestoneData {
  childId: string;
  title: string;
  description?: string | null;
  milestoneDate: Date;
}

export interface IMilestoneRepository {
  findById(id: string): Promise<MilestoneEntity | null>;
  findManyByChild(
    childId: string,
    params: { cursor?: string; limit: number },
  ): Promise<{ data: MilestoneEntity[]; cursor: string | null; hasMore: boolean }>;
  create(data: CreateMilestoneData): Promise<MilestoneEntity>;
  update(id: string, data: Partial<CreateMilestoneData>): Promise<MilestoneEntity>;
  softDelete(id: string): Promise<void>;
}
