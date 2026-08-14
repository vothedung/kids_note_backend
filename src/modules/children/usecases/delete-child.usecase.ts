import { Inject, Injectable } from '@nestjs/common';
import { CHILD_REPOSITORY, IChildRepository } from '../repositories/child.repository.interface';
import { ChildAccessService } from '../services/child-access.service';

@Injectable()
export class DeleteChildUseCase {
  constructor(
    @Inject(CHILD_REPOSITORY) private readonly childRepo: IChildRepository,
    private readonly childAccessService: ChildAccessService,
  ) {}

  async execute(input: { id: string }): Promise<void> {
    await this.childAccessService.getChildOrThrow(input.id);
    await this.childRepo.softDelete(input.id);
  }
}
