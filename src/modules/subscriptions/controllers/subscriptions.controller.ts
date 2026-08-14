import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FamilyAccessGuard } from '../../families/guards/family-access.guard';
import { UpdateSubscriptionDto } from '../dtos/update-subscription.dto';
import { GetSubscriptionUseCase } from '../usecases/get-subscription.usecase';
import { UpdateSubscriptionUseCase } from '../usecases/update-subscription.usecase';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyAccessGuard, RolesGuard)
@Controller({ path: 'families/:id/subscription', version: '1' })
export class SubscriptionsController {
  constructor(
    private readonly getSubscription: GetSubscriptionUseCase,
    private readonly updateSubscription: UpdateSubscriptionUseCase,
  ) {}

  @Get()
  @Roles(FamilyRole.OWNER, FamilyRole.PARENT)
  @ApiOperation({ summary: 'Get family subscription (OWNER, PARENT)' })
  async get(@Param('id') familyId: string) {
    return this.getSubscription.execute({ familyId });
  }

  @Patch()
  @Roles(FamilyRole.OWNER)
  @ApiOperation({ summary: 'Update family subscription plan (OWNER only)' })
  async update(
    @Param('id') familyId: string,
    @CurrentUser('id') actingUserId: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.updateSubscription.execute({
      familyId,
      plan: dto.plan,
      expiredAt: dto.expiredAt,
      actingUserId,
    });
  }
}
