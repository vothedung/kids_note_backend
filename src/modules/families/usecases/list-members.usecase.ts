import { Inject, Injectable } from '@nestjs/common';
import {
  FAMILY_MEMBER_REPOSITORY,
  IFamilyMemberRepository,
} from '../repositories/family-member.repository.interface';

@Injectable()
export class ListMembersUseCase {
  constructor(
    @Inject(FAMILY_MEMBER_REPOSITORY) private readonly memberRepo: IFamilyMemberRepository,
  ) {}

  async execute(input: { familyId: string }) {
    const data = await this.memberRepo.findManyByFamily(input.familyId);
    return { data, meta: { hasMore: false } };
  }
}
