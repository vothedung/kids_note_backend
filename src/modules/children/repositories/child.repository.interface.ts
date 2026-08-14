import { Gender } from '@prisma/client';
import { ChildEntity } from '../entities/child.entity';

export const CHILD_REPOSITORY = Symbol('CHILD_REPOSITORY');

export interface CreateChildData {
  familyId: string;
  name: string;
  birthday: Date;
  gender: Gender;
  avatarUrl?: string | null;
}

export interface IChildRepository {
  findById(id: string): Promise<ChildEntity | null>;
  findManyByFamily(familyId: string): Promise<ChildEntity[]>;
  create(data: CreateChildData): Promise<ChildEntity>;
  update(id: string, data: Partial<CreateChildData>): Promise<ChildEntity>;
  softDelete(id: string): Promise<void>;
}
