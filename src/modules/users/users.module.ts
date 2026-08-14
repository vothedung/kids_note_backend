import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { UserPrismaRepository } from './repositories/user.prisma-repository';
import { UsersService } from './services/users.service';
import { GetUserProfileUseCase } from './usecases/get-user-profile.usecase';
import { UpdateUserProfileUseCase } from './usecases/update-user-profile.usecase';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
    UsersService,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
  ],
  exports: [UsersService],
})
export class UsersModule {}
