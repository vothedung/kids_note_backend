import { Inject, Injectable } from '@nestjs/common';
import {
  CHILD_REPOSITORY,
  CreateChildData,
  IChildRepository,
} from '../repositories/child.repository.interface';
import { ChildAccessService } from '../services/child-access.service';

@Injectable()
export class UpdateChildUseCase {
  constructor(
    @Inject(CHILD_REPOSITORY) private readonly childRepo: IChildRepository,
    private readonly childAccessService: ChildAccessService,
  ) {}

  async execute(input: { id: string } & Partial<CreateChildData>) {
    await this.childAccessService.getChildOrThrow(input.id);
    const { id, ...data } = input;
    return this.childRepo.update(id, data);
  }
}
