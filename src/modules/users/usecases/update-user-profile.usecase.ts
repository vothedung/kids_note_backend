import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(input: { userId: string; fullName?: string; avatarUrl?: string }) {
    const { userId, ...data } = input;
    const user = await this.usersService.updateProfile(userId, data);
    return user.toPublic();
  }
}
