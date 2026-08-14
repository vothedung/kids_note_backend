import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(input: { userId: string }) {
    const user = await this.usersService.getOrThrow(input.userId);
    return user.toPublic();
  }
}
