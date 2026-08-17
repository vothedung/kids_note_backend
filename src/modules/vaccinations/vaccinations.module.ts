import { Module } from '@nestjs/common';
import { ChildrenModule } from '../children/children.module';
import { VaccinationsController } from './controllers/vaccinations.controller';
import { VACCINATION_REPOSITORY } from './repositories/vaccination.repository.interface';
import { VaccinationPrismaRepository } from './repositories/vaccination.prisma-repository';
import { CreateVaccinationUseCase } from './usecases/create-vaccination.usecase';
import { ListVaccinationsUseCase } from './usecases/list-vaccinations.usecase';
import { UpdateVaccinationUseCase } from './usecases/update-vaccination.usecase';
import { DeleteVaccinationUseCase } from './usecases/delete-vaccination.usecase';
import { UpdateReminderSettingsUseCase } from './usecases/update-reminder-settings.usecase';

@Module({
  imports: [ChildrenModule],
  controllers: [VaccinationsController],
  providers: [
    { provide: VACCINATION_REPOSITORY, useClass: VaccinationPrismaRepository },
    CreateVaccinationUseCase,
    ListVaccinationsUseCase,
    UpdateVaccinationUseCase,
    DeleteVaccinationUseCase,
    UpdateReminderSettingsUseCase,
  ],
  exports: [ListVaccinationsUseCase],
})
export class VaccinationsModule {}
