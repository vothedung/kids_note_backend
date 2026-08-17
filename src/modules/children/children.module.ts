import { Module } from '@nestjs/common';
import { FamiliesModule } from '../families/families.module';
import { ChildrenController } from './controllers/children.controller';
import { CHILD_REPOSITORY } from './repositories/child.repository.interface';
import { ChildPrismaRepository } from './repositories/child.prisma-repository';
import { ChildAccessService } from './services/child-access.service';
import { ChildAccessGuard } from './guards/child-access.guard';
import { CreateChildUseCase } from './usecases/create-child.usecase';
import { GetChildUseCase } from './usecases/get-child.usecase';
import { ListChildrenUseCase } from './usecases/list-children.usecase';
import { UpdateChildUseCase } from './usecases/update-child.usecase';
import { DeleteChildUseCase } from './usecases/delete-child.usecase';

@Module({
  imports: [FamiliesModule],
  controllers: [ChildrenController],
  providers: [
    { provide: CHILD_REPOSITORY, useClass: ChildPrismaRepository },
    ChildAccessService,
    ChildAccessGuard,
    CreateChildUseCase,
    GetChildUseCase,
    ListChildrenUseCase,
    UpdateChildUseCase,
    DeleteChildUseCase,
  ],
  exports: [ChildAccessService, ChildAccessGuard, GetChildUseCase],
})
export class ChildrenModule {}
