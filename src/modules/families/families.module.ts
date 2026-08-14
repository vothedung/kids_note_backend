import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SharedModule } from '../shared/shared.module';
import { FamiliesController } from './controllers/families.controller';
import { FAMILY_REPOSITORY } from './repositories/family.repository.interface';
import { FamilyPrismaRepository } from './repositories/family.prisma-repository';
import { FAMILY_MEMBER_REPOSITORY } from './repositories/family-member.repository.interface';
import { FamilyMemberPrismaRepository } from './repositories/family-member.prisma-repository';
import { FamilyMembershipService } from './services/family-membership.service';
import { FamilyAccessGuard } from './guards/family-access.guard';
import { CreateFamilyUseCase } from './usecases/create-family.usecase';
import { ListFamiliesUseCase } from './usecases/list-families.usecase';
import { UpdateFamilyUseCase } from './usecases/update-family.usecase';
import { CreateInvitationUseCase } from './usecases/create-invitation.usecase';
import { ListMembersUseCase } from './usecases/list-members.usecase';
import { UpdateMemberRoleUseCase } from './usecases/update-member-role.usecase';

@Module({
  imports: [UsersModule, SharedModule],
  controllers: [FamiliesController],
  providers: [
    { provide: FAMILY_REPOSITORY, useClass: FamilyPrismaRepository },
    { provide: FAMILY_MEMBER_REPOSITORY, useClass: FamilyMemberPrismaRepository },
    FamilyMembershipService,
    FamilyAccessGuard,
    CreateFamilyUseCase,
    ListFamiliesUseCase,
    UpdateFamilyUseCase,
    CreateInvitationUseCase,
    ListMembersUseCase,
    UpdateMemberRoleUseCase,
  ],
  exports: [FamilyMembershipService, FamilyAccessGuard],
})
export class FamiliesModule {}
