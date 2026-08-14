import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: { refreshToken: string }) {
    return this.tokenService.rotateRefreshToken(input.refreshToken, (id) =>
      this.usersService.findById(id),
    );
  }
}
