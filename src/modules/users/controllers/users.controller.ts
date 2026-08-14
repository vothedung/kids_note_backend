import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { GetUserProfileUseCase } from '../usecases/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from '../usecases/update-user-profile.usecase';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly getUserProfile: GetUserProfileUseCase,
    private readonly updateUserProfile: UpdateUserProfileUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current authenticated user profile' })
  async me(@CurrentUser('id') userId: string) {
    return this.getUserProfile.execute({ userId });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current authenticated user profile' })
  async updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.updateUserProfile.execute({ userId, ...dto });
  }
}
