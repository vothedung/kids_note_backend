import { FamilyEntity } from '../entities/family.entity';

export const FAMILY_REPOSITORY = Symbol('FAMILY_REPOSITORY');

export interface IFamilyRepository {
  findById(id: string): Promise<FamilyEntity | null>;
  findByIdForUser(id: string, userId: string): Promise<FamilyEntity | null>;
  findManyForUser(userId: string): Promise<FamilyEntity[]>;
  create(data: { name: string; ownerId: string }): Promise<FamilyEntity>;
  update(id: string, data: Partial<{ name: string }>): Promise<FamilyEntity>;
  softDelete(id: string): Promise<void>;
}
