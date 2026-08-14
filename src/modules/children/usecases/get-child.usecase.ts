import { Injectable } from '@nestjs/common';
import { ChildAccessService } from '../services/child-access.service';

@Injectable()
export class GetChildUseCase {
  constructor(private readonly childAccessService: ChildAccessService) {}

  async execute(input: { id: string }) {
    return this.childAccessService.getChildOrThrow(input.id);
  }
}
